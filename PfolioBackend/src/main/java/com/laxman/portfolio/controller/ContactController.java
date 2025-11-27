package com.laxman.portfolio.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.laxman.portfolio.model.Contact;
import com.laxman.portfolio.service.ContactService;

@RestController
@RequestMapping("/contacts")
@CrossOrigin(origins = "*") 
public class ContactController {

    //private final ContactServiceImpl contactServiceImpl;

    @Autowired
    private ContactService contactService;

//    ContactController(ContactServiceImpl contactServiceImpl) {
//        this.contactServiceImpl = contactServiceImpl;
//    }
    

    @PostMapping("/add")
    public Contact addContact(@RequestBody Contact contact) {
        return contactService.addContact(contact);
    }

    @GetMapping("/all")
    public List<Contact> getAllContacts() {
        return contactService.viewAllContacts();
    }

    @DeleteMapping("/delete/{id}")
    public String deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return "Contact with ID " + id + " has been deleted.";
    }
    
    @GetMapping("/countmessages")
    public long countMessages() {
    	return contactService.countMessages();
    }
}
