package com.example.MajorProject.Repository;

import com.example.MajorProject.Model.GiongDoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GiongDocRepository extends JpaRepository<GiongDoc, Long> {
}