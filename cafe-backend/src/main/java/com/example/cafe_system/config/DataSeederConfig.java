package com.example.cafe_system.config;

import com.example.cafe_system.auth.domain.Role;
import com.example.cafe_system.auth.repository.UserRepository;
import com.example.cafe_system.auth.service.AuthService;
import com.example.cafe_system.menu_item.domain.MenuItem;
import com.example.cafe_system.menu_item.domain.MenuItemCategory;
import com.example.cafe_system.menu_item.repository.MenuItemRepository;
import com.example.cafe_system.table.domain.CafeTable;
import com.example.cafe_system.table.repository.CafeTableRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.util.List;

@Configuration
@Profile("local")
@Slf4j
public class DataSeederConfig {

    @Bean
    CommandLineRunner initDatabase(
            MenuItemRepository menuRepo,
            CafeTableRepository tableRepo,
            UserRepository userRepo,
            AuthService authService
    ) {
        return args -> {
            log.info("Checking database seed status...");
            seedUsers(userRepo, authService);
            seedMenuItems(menuRepo);
            seedTables(tableRepo);
            log.info("Database seeding checks completed.");
        };
    }

    private void seedUsers(UserRepository userRepo, AuthService authService) {
        if (userRepo.count() == 0) {
            authService.register("admin", "admin", Role.ADMIN);
            log.info("Inserted default admin user.");
        }
    }

    private void seedMenuItems(MenuItemRepository menuRepo) {
        if (menuRepo.count() == 0) {
            List<MenuItem> menuItems = List.of(
                    new MenuItem("Espresso", 250, MenuItemCategory.DRINK),
                    new MenuItem("Latte", 350, MenuItemCategory.DRINK),
                    new MenuItem("Craft Beer", 500, MenuItemCategory.DRINK),
                    new MenuItem("Avocado Toast", 850, MenuItemCategory.MEAL),
                    new MenuItem("Classic Cheeseburger", 1200, MenuItemCategory.MEAL),
                    new MenuItem("Truffle Fries", 650, MenuItemCategory.MEAL),
                    new MenuItem("Chocolate Lava Cake", 700, MenuItemCategory.DESSERT),
                    new MenuItem("Cheesecake", 650, MenuItemCategory.DESSERT)
            );
            menuRepo.saveAll(menuItems);
            log.info("Inserted {} menu items.", menuItems.size());
        }
    }

    private void seedTables(CafeTableRepository tableRepo) {
        if (tableRepo.count() == 0) {
            List<CafeTable> tables = List.of(
                    new CafeTable(1, 2),
                    new CafeTable(2, 4),
                    new CafeTable(4, 4),
                    new CafeTable(5, 2),
                    new CafeTable(7, 2),
                    new CafeTable(9, 4),
                    new CafeTable(12, 6),
                    new CafeTable(14, 4)
            );
            tableRepo.saveAll(tables);
            log.info("Inserted {} tables.", tables.size());
        }
    }
}