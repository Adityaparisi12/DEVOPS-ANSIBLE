package com.laxman.portfolio.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.laxman.portfolio.model.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

}
