package com.example.MajorProject.Repository;

import com.example.MajorProject.Model.CuaHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CuaHangRepository extends JpaRepository<CuaHang, String> {

    List<CuaHang> findByIduser(Long iduser);

    List<CuaHang> findByTenContainingIgnoreCase(String keyword);

    List<CuaHang> findByTrangThai(Integer trangThai);
}