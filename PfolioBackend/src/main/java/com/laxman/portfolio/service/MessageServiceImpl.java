package com.laxman.portfolio.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.laxman.portfolio.model.Message;
import com.laxman.portfolio.repository.MessageRepository;

import jakarta.mail.internet.MimeMessage;
import java.util.List;
import java.util.logging.Logger;

@Service
public class MessageServiceImpl implements MessageService {

    private static final Logger logger = Logger.getLogger(MessageServiceImpl.class.getName());

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MessageRepository messageRepository;

    @Value("${spring.mail.username:your-email@gmail.com}")
    private String fromEmail;

    @Override
    public String sendReplyMessage(Message message) {
        // Validate input
        if (message == null) {
            return "Message object is null";
        }
        
        if (message.getEmail() == null || message.getEmail().trim().isEmpty()) {
            return "Recipient email is required";
        }
        
        if (message.getMessage() == null || message.getMessage().trim().isEmpty()) {
            return "Message content is required";
        }

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        
        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            // Set sender and recipient
            helper.setFrom(fromEmail);
            helper.setTo(message.getEmail());
            
            // Set subject with proper prefix
            String subject = message.getSubject() != null && !message.getSubject().trim().isEmpty() 
                ? "Reply: " + message.getSubject() 
                : "Reply to your message";
            helper.setSubject(subject);
            
            // Create styled HTML content
            String htmlContent = createStyledEmailContent(message.getMessage());
            helper.setText(htmlContent, true);
            
            // Send email
            mailSender.send(mimeMessage);
            
            logger.info("Email sent successfully to: " + message.getEmail());
            return "Email sent successfully to " + message.getEmail();
            
        } catch (Exception e) {
            logger.severe("Failed to send email: " + e.getMessage());
            return "Failed to send email: " + e.getMessage();
        }
    }

    @Override
    public String saveMessage(Message message) {
        try {
            if (message == null) {
                return "Message object is null";
            }
            messageRepository.save(message);
            return "Message saved successfully";
        } catch (Exception e) {
            logger.severe("Failed to save message: " + e.getMessage());
            return "Failed to save message: " + e.getMessage();
        }
    }

    @Override
    public List<Message> getAllMessages() {
        try {
            return messageRepository.findAll();
        } catch (Exception e) {
            logger.severe("Failed to fetch messages: " + e.getMessage());
            return new java.util.ArrayList<>();
        }
    }

    private String createStyledEmailContent(String messageContent) {
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reply Email</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        line-height: 1.6;
                        background-color: #f0f8ff;
                        color: #333;
                        padding: 20px 0;
                    }
                    
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 12px;
                        box-shadow: 0 8px 32px rgba(70, 130, 180, 0.15);
                        overflow: hidden;
                        border: 1px solid #e6f3ff;
                    }
                    
                    .header {
                        background: linear-gradient(135deg, #4682b4 0%, #2c3e50 50%, #4682b4 100%);
                        color: white;
                        padding: 40px 30px;
                        text-align: center;
                        position: relative;
                        overflow: hidden;
                    }
                    
                    .header::before {
                        content: '';
                        position: absolute;
                        top: -50%;
                        left: -50%;
                        width: 200%;
                        height: 200%;
                        background: radial-gradient(circle, rgba(135, 206, 235, 0.1) 0%, transparent 70%);
                        animation: pulse 4s ease-in-out infinite;
                    }
                    
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); opacity: 0.5; }
                        50% { transform: scale(1.1); opacity: 0.8; }
                    }
                    
                    .header h1 {
                        font-size: 28px;
                        font-weight: 300;
                        text-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        position: relative;
                        z-index: 1;
                        margin-bottom: 8px;
                    }
                    
                    .header p {
                        font-size: 16px;
                        opacity: 0.9;
                        position: relative;
                        z-index: 1;
                    }
                    
                    .content {
                        padding: 50px 40px;
                        background-color: #ffffff;
                    }
                    
                    .greeting {
                        font-size: 20px;
                        color: #2c3e50;
                        margin-bottom: 25px;
                        font-weight: 500;
                    }
                    
                    .intro-text {
                        font-size: 16px;
                        color: #555;
                        margin-bottom: 30px;
                        line-height: 1.7;
                    }
                    
                    .message-content {
                        background: linear-gradient(135deg, #f8fdff 0%, #e6f3ff 100%);
                        border-left: 5px solid #4682b4;
                        border-radius: 0 12px 12px 0;
                        padding: 30px;
                        margin: 30px 0;
                        font-size: 16px;
                        line-height: 1.8;
                        color: #2c3e50;
                        box-shadow: 0 4px 15px rgba(70, 130, 180, 0.1);
                        position: relative;
                    }
                    
                    .message-content::before {
                        content: '"';
                        position: absolute;
                        top: -10px;
                        left: 15px;
                        font-size: 60px;
                        color: #87ceeb;
                        opacity: 0.3;
                        font-family: Georgia, serif;
                    }
                    
                    .divider {
                        height: 3px;
                        background: linear-gradient(90deg, transparent 0%, #4682b4 20%, #87ceeb 50%, #4682b4 80%, transparent 100%);
                        margin: 40px 0;
                        border-radius: 2px;
                    }
                    
                    .signature {
                        margin-top: 40px;
                        padding-top: 30px;
                        border-top: 2px solid #e6f3ff;
                        text-align: left;
                    }
                    
                    .signature-name {
                        font-size: 20px;
                        font-weight: 600;
                        color: #4682b4;
                        margin-bottom: 8px;
                    }
                    
                    .signature-title {
                        font-size: 14px;
                        color: #666;
                        font-style: italic;
                        margin-bottom: 15px;
                    }
                    
                    .contact-info {
                        font-size: 13px;
                        color: #888;
                        line-height: 1.6;
                    }
                    
                    .footer {
                        background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                        color: white;
                        text-align: center;
                        padding: 30px 20px;
                        font-size: 13px;
                        line-height: 1.6;
                    }
                    
                    .footer a {
                        color: #87ceeb;
                        text-decoration: none;
                        transition: color 0.3s ease;
                    }
                    
                    .footer a:hover {
                        color: #add8e6;
                    }
                    
                    .footer-divider {
                        width: 100px;
                        height: 1px;
                        background: #87ceeb;
                        margin: 20px auto;
                        opacity: 0.5;
                    }
                    
                    @media only screen and (max-width: 600px) {
                        body {
                            padding: 10px 0;
                        }
                        
                        .email-container {
                            margin: 0 10px;
                            border-radius: 8px;
                        }
                        
                        .content {
                            padding: 30px 20px;
                        }
                        
                        .header {
                            padding: 30px 20px;
                        }
                        
                        .header h1 {
                            font-size: 24px;
                        }
                        
                        .message-content {
                            padding: 20px;
                            margin: 20px 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <h1>Thank You for Reaching Out!</h1>
                        <p>We've received your message and here's our response</p>
                    </div>
                    
                    <div class="content">
                        <div class="greeting">Hello there! 👋</div>
                        
                        <p class="intro-text">
                            Thank you for taking the time to contact us. We appreciate your message 
                            and are pleased to provide you with our response below.
                        </p>
                        
                        <div class="message-content">
                            """ + escapeHtml(messageContent) + """
                        </div>
                        
                        <div class="divider"></div>
                        
                        <div class="signature">
                            <div class="signature-name">Best Regards,</div>
                            <div class="signature-name">Laxman</div>
                            <div class="signature-title">Portfolio Support Team</div>
                            <div class="contact-info">
                                📧 Portfolio Support<br>
                                🌐 Professional Services<br>
                                📱 Available 24/7
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p><strong>This is an automated response email.</strong></p>
                        <div class="footer-divider"></div>
                        <p>Please do not reply directly to this email address.</p>
                        <p>&copy; 2024 Laxman Portfolio. All rights reserved.</p>
                        <p>Need help? Visit our <a href="#">support center</a> or <a href="#">contact us</a></p>
                    </div>
                </div>
            </body>
            </html>
            """;
    }

    // Enhanced HTML escaping method
    private String escapeHtml(String text) {
        if (text == null || text.trim().isEmpty()) {
            return "No message content provided.";
        }
        
        return text.replace("&", "&amp;")
                  .replace("<", "&lt;")
                  .replace(">", "&gt;")
                  .replace("\"", "&quot;")
                  .replace("'", "&#39;")
                  .replace("\n", "<br>")
                  .replace("\r\n", "<br>")
                  .replace("\r", "<br>");
    }
}