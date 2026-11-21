package com.example.MajorProject.Repository;
import com.example.MajorProject.Model.BanDich;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BanDichRepository extends JpaRepository<BanDich, Long> {
    // Hàm này giúp lấy danh sách bản dịch của 1 cửa hàng cụ thể
    List<BanDich> findByIdCuaHang(String idCuaHang);
}