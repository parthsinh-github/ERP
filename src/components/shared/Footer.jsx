import React, { useState, useEffect } from 'react';
import { Heart, Code, Globe, Mail, Phone, MapPin, Github, Linkedin, Twitter, ExternalLink } from 'lucide-react';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredSocial, setHoveredSocial] = useState(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const footerStyle = {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 'auto',
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
    zIndex: 1,
  };

  const containerStyle = {
    position: 'relative',
    zIndex: 2,
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 24px 24px',
  };

  const mainContentStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '40px',
    marginBottom: '40px',
  };

  const brandSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const logoStyle = {
    fontSize: '2rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #60a5fa, #34d399, #f59e0b)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.025em',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const descriptionStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1rem',
    lineHeight: '1.6',
    maxWidth: '300px',
  };

  const sectionTitleStyle = {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: 'white',
    marginBottom: '16px',
    letterSpacing: '-0.025em',
  };

  const linkStyle = (isHovered) => ({
    // color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    fontSize: '0.95rem',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 0',
    borderRadius: '4px',
    transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
    color: isHovered ? '#60a5fa' : 'rgba(255, 255, 255, 0.7)',
  });

  const socialLinksStyle = {
    display: 'flex',
    gap: '16px',
    marginTop: '16px',
  };

  const socialButtonStyle = (isHovered, platform) => {
    const colors = {
      github: '#333',
      linkedin: '#0077b5',
      twitter: '#1da1f2',
      email: '#ea4335',
    };

    return {
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isHovered 
        ? colors[platform] || 'rgba(255, 255, 255, 0.1)'
        : 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'pointer',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      transform: isHovered ? 'translateY(-2px) scale(1.05)' : 'translateY(0) scale(1)',
      boxShadow: isHovered ? '0 8px 16px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
    };
  };

  const bottomSectionStyle = {
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const copyrightStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.9rem',
  };

  const developerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
  };

  const heartStyle = {
    color: '#ef4444',
    animation: 'heartbeat 2s ease-in-out infinite',
  };

  const quickLinks = [
    { name: 'About Us', href: '/about', icon: Globe },
    { name: 'Contact', href: '/contact', icon: Mail },
    { name: 'Privacy Policy', href: '/privacy', icon: ExternalLink },
    { name: 'Terms of Service', href: '/terms', icon: ExternalLink },
  ];

  const contactInfo = [
    { icon: Mail, text: 'support@collegeerp.com', href: 'mailto:support@collegeerp.com' },
    { icon: Phone, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPin, text: '123 Education St, Learning City', href: '#' },
  ];

  const socialLinks = [
    { platform: 'github', icon: Github, href: 'https://github.com/cheetahsingh' },
    { platform: 'linkedin', icon: Linkedin, href: 'https://linkedin.com/in/cheetahsingh' },
    { platform: 'twitter', icon: Twitter, href: 'https://twitter.com/cheetahsingh' },
    { platform: 'email', icon: Mail, href: 'mailto:cheetah@example.com' },
  ];

  const handleLinkClick = (href) => {
    console.log(`Navigating to: ${href}`);
    // In a real app, you would use navigate or window.open
  };

  return (
    <footer style={footerStyle}>
      <div style={overlayStyle} />
      
      <div style={containerStyle}>
        <div style={mainContentStyle}>
          {/* Brand Section */}
          <div style={brandSectionStyle}>
            <div style={logoStyle}>
              <Code size={32} />
              College ERP
            </div>
            <p style={descriptionStyle}>
              Empowering educational institutions with modern, efficient, and comprehensive 
              enterprise resource planning solutions.
            </p>
            <div style={socialLinksStyle}>
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <div
                    key={social.platform}
                    style={socialButtonStyle(hoveredSocial === social.platform, social.platform)}
                    onMouseEnter={() => setHoveredSocial(social.platform)}
                    onMouseLeave={() => setHoveredSocial(null)}
                    onClick={() => handleLinkClick(social.href)}
                  >
                    <IconComponent size={20} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 style={sectionTitleStyle}>Quick Links</h3>
            <nav>
              {quickLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    style={linkStyle(hoveredLink === link.name)}
                    onMouseEnter={() => setHoveredLink(link.name)}
                    onMouseLeave={() => setHoveredLink(null)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                  >
                    <IconComponent size={16} />
                    {link.name}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 style={sectionTitleStyle}>Contact Info</h3>
            <div>
              {contactInfo.map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <a
                    key={index}
                    href={contact.href}
                    style={linkStyle(hoveredLink === contact.text)}
                    onMouseEnter={() => setHoveredLink(contact.text)}
                    onMouseLeave={() => setHoveredLink(null)}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(contact.href);
                    }}
                  >
                    <IconComponent size={16} />
                    {contact.text}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={bottomSectionStyle}>
          <div style={copyrightStyle}>
            <div>
              © {currentYear} College ERP. All rights reserved.
            </div>
            <div style={developerStyle}>
              Made with <Heart size={16} style={heartStyle} /> by 
              <strong style={{ color: '#60a5fa', marginLeft: '4px' }}>Cheetah Singh</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Add heartbeat animation */}
      <style>
        {`
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
          }
        `}
      </style>
    </footer>
  );
};

export default Footer;