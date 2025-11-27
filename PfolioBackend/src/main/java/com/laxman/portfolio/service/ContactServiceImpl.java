package com.laxman.portfolio.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.laxman.portfolio.model.Contact;
import com.laxman.portfolio.repository.ContactRepository;

@Service
public class ContactServiceImpl implements ContactService {

	@Autowired
	private ContactRepository contactRepository;

	@Override
	public Contact addContact(Contact con) {
		return contactRepository.save(con);
	}

	@Override
	public List<Contact> viewAllContacts() {
		return contactRepository.findAll();
	}

	@Override
	public void deleteContact(Long id) {
		contactRepository.deleteById(id);
	}

	@Override
	public long countMessages() {
		
		return contactRepository.count();
	}
}
