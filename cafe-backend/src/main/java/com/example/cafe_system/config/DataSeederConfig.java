package com.example.cafe_system.config;

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
    CommandLineRunner initDatabase(MenuItemRepository menuRepo, CafeTableRepository tableRepo) {
        return args -> {
            if (menuRepo.count() == 0 && tableRepo.count() == 0) {
                log.info("Populating database with seed data...");

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

                log.info("Database seeding completed successfully!");
            } else {
                log.info("Database already contains data. Skipping seeder.");
            }
        };
    }
}