package com.laxman.portfolio.model;

import java.util.Date;
import jakarta.persistence.*;

@Entity
@Table(name = "projects")
public class Projects {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String fdescription;
    
    private String category;
    
    @Temporal(TemporalType.DATE)
    private Date sdate;
    
    @Temporal(TemporalType.DATE)
    private Date edate;
    
    private String technologies;
    private String gitlink;
    private String liveurl;
    private String imgurl;

    // Default constructor
    public Projects() {}

    // Parameterized constructor
    public Projects(Long id, String title, String description, String fdescription, String category,
                   Date sdate, Date edate, String technologies, String gitlink, String liveurl, String imgurl) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.fdescription = fdescription;
        this.category = category;
        this.sdate = sdate;
        this.edate = edate;
        this.technologies = technologies;
        this.gitlink = gitlink;
        this.liveurl = liveurl;
        this.imgurl = imgurl;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public String getFdescription() { return fdescription; }
    public void setFdescription(String fdescription) { this.fdescription = fdescription; }
    
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    
    public Date getSdate() { return sdate; }
    public void setSdate(Date sdate) { this.sdate = sdate; }
    
    public Date getEdate() { return edate; }
    public void setEdate(Date edate) { this.edate = edate; }
    
    public String getTechnologies() { return technologies; }
    public void setTechnologies(String technologies) { this.technologies = technologies; }
    
    public String getGitlink() { return gitlink; }
    public void setGitlink(String gitlink) { this.gitlink = gitlink; }
    
    public String getLiveurl() { return liveurl; }
    public void setLiveurl(String liveurl) { this.liveurl = liveurl; }
    
    public String getImgurl() { return imgurl; }
    public void setImgurl(String imgurl) { this.imgurl = imgurl; }
}