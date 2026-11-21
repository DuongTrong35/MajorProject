package com.example.MajorProject.Repository;

import com.example.MajorProject.Model.LichTrinhTour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LichTrinhTourRepository extends JpaRepository<LichTrinhTour, Integer> {

    List<LichTrinhTour> findByTourIdOrderByThuTuTramAsc(Integer tourId);

}