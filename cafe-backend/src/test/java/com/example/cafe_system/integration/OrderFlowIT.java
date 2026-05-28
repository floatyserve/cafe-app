package com.example.cafe_system.integration;

import com.example.cafe_system.menu_item.domain.MenuItem;
import com.example.cafe_system.menu_item.domain.MenuItemCategory;
import com.example.cafe_system.menu_item.repository.MenuItemRepository;
import com.example.cafe_system.order.api.dto.CreateOrderRequest;
import com.example.cafe_system.order.domain.OrderState;
import com.example.cafe_system.table.domain.CafeTable;
import com.example.cafe_system.table.repository.CafeTableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import tools.jackson.databind.json.JsonMapper;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
@Sql(scripts = "/cleanup.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class OrderFlowIT extends BaseIT {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JsonMapper jsonMapper;

    @Autowired
    private CafeTableRepository tableRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    private Long tableId;

    @BeforeEach
    void setUp() {
        tableId = tableRepository.save(new CafeTable(1, 4)).getId();
        menuItemRepository.save(new MenuItem("Latte", 450, MenuItemCategory.DRINK));
    }

    @Test
    void shouldCreateOrderAndProcessPayment_EndToEnd() throws Exception {
        String response = performCreateOrder(tableId)
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.state").value(OrderState.OPEN.name()))
                .andReturn().getResponse().getContentAsString();

        Long orderId = extractIdFromResponse(response);

        performPayOrder(orderId)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.state").value(OrderState.PAID.name()))
                .andExpect(jsonPath("$.paidAt").exists());
    }

    @Test
    void shouldReturn400_WhenCreatingOrderForOccupiedTable() throws Exception {
        performCreateOrder(tableId).andExpect(status().isCreated());
        performCreateOrder(tableId).andExpect(status().isBadRequest());
    }

    private ResultActions performCreateOrder(Long tableId) throws Exception {
        CreateOrderRequest request = new CreateOrderRequest(tableId);
        return mockMvc.perform(post("/api/orders")
                .with(user("admin").roles("ADMIN"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonMapper.writeValueAsString(request)));
    }

    private ResultActions performPayOrder(Long orderId) throws Exception {
        return mockMvc.perform(put("/api/orders/" + orderId + "/pay")
                .with(user("admin").roles("ADMIN")));
    }

    private Long extractIdFromResponse(String response) {
        return Long.parseLong(response.split("\"id\":")[1].split(",")[0].trim());
    }
}
