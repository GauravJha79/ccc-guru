"use client";

import { useState } from "react";
import Link from "next/link";
import { Languages, BookOpen, Clock, ArrowRight } from "lucide-react";

export interface SyllabusChapterData {
  no: number;
  titleEn: string;
  titleHi: string;
  hindiSub: string;
  theoryHours: number;
  practicalHours: number;
  descriptionEn: string;
  descriptionHi: string;
  topicsEn: string[];
  topicsHi: string[];
}

export const REVISED_SYLLABUS_DATA: SyllabusChapterData[] = [
  {
    no: 1,
    titleEn: "Introduction to Computer",
    titleHi: "कम्प्यूटर का परिचय",
    hindiSub: "कम्प्यूटर का परिचय",
    theoryHours: 3,
    practicalHours: 6,
    descriptionEn: "Understand fundamentals, hardware, software, memory hierarchy, and basic applications of computers.",
    descriptionHi: "कम्प्यूटर के मूल सिद्धांत, हार्डवेयर, सॉफ्टवेयर, मेमोरी संरचना, और दैनिक जीवन में कम्प्यूटर के अनुप्रयोगों को समझें।",
    topicsEn: [
      "Introduction & Objectives of Computer Systems",
      "What is Computer? History & Generation of Computers",
      "Characteristics of Computer System & Basic Applications",
      "Components of Computer: CPU, VDU, Keyboard, Mouse, Input/Output Devices",
      "Computer Memory & Storage Devices: Primary Memory (RAM, ROM), Secondary Storage (HDD, SSD, Flash)",
      "Concept of Hardware, Software, System Software, Application Software & Utility Software",
      "Open Source Software vs Proprietary Software",
      "Representation of Data/Information & Concept of Data Processing",
      "Applications of IECT in E-Governance, Entertainment & Daily Life",
    ],
    topicsHi: [
      "कम्प्यूटर सिस्टम का परिचय एवं उद्देश्य",
      "कम्प्यूटर क्या है? कम्प्यूटर का इतिहास एवं पीढ़ियां (Generations)",
      "कम्प्यूटर की विशेषताएं एवं बुनियादी अनुप्रयोग",
      "कम्प्यूटर के मुख्य घटक: CPU, VDU, कीबोर्ड, माउस, इनपुट एवं आउटपुट डिवाइसेज",
      "कम्प्यूटर मेमोरी और स्टोरेज डिवाइसेज: प्राइमरी मेमोरी (RAM, ROM), सेकेंडरी स्टोरेज (HDD, SSD, पेन ड्राइव)",
      "हार्डवेयर और सॉफ्टवेयर की अवधारणा: सिस्टम सॉफ्टवेयर, एप्लिकेशन सॉफ्टवेयर और यूटिलिटी सॉफ्टवेयर",
      "ओपन सोर्स सॉफ्टवेयर (Open Source) बनाम प्रोप्राइटरी सॉफ्टवेयर (Proprietary)",
      "डेटा/सूचना का निरूपण एवं डेटा प्रोसेसिंग की अवधारणा",
      "ई-गवर्नेंस, मनोरंजन और दैनिक जीवन में IECT के अनुप्रयोग",
    ],
  },
  {
    no: 2,
    titleEn: "Introduction to Operating System",
    titleHi: "ऑपरेटिंग सिस्टम का परिचय",
    hindiSub: "ऑपरेटिंग सिस्टम का परिचय",
    theoryHours: 3,
    practicalHours: 6,
    descriptionEn: "Learn OS concepts, GUI navigation in Windows and Ubuntu Linux, file management, and system settings.",
    descriptionHi: "ऑपरेटिंग सिस्टम की अवधारणाएं, विंडोज एवं उबंटू लिनक्स में नेविगेशन, फाइल मैनेजमेंट और सिस्टम सेटिंग्स सीखें।",
    topicsEn: [
      "Basics of Operating System & Primary Functions",
      "Operating Systems for Desktop/Laptop: Windows, Linux, Ubuntu",
      "Operating Systems for Mobile Phones & Tablets: Android, iOS",
      "User Interface for Desktop and Laptop: Taskbar, Icons, Shortcuts, Running Applications",
      "Operating System Settings: Date & Time, Display properties, Adding/Removing Printers",
      "File and Directory Management: Creating, Renaming, Moving, Copying, Deleting Files & Folders",
      "Common File Extensions: .txt, .odt, .ods, .odp, .pdf, .jpg, .zip, etc.",
    ],
    topicsHi: [
      "ऑपरेटिंग सिस्टम की मूल बातें एवं इसके मुख्य कार्य (Functions)",
      "डेस्कटॉप और लैपटॉप के लिए ऑपरेटिंग सिस्टम: विंडोज (Windows), लिनक्स (Linux), उबंटू (Ubuntu)",
      "मोबाइल फोन एवं टैबलेट के ऑपरेटिंग सिस्टम: एंड्रॉइड (Android), आईओएस (iOS)",
      "यूजर इंटरफेस: टास्कबार, आइकन्स, शॉर्टकट्स, और एप्लिकेशन चलाना",
      "ऑपरेटिंग सिस्टम सेटिंग्स: दिनांक व समय बदलना, डिस्प्ले सेटिंग्स, प्रिंटर जोड़ना और हटाना",
      "फाइल एवं डायरेक्टरी प्रबंधन: फाइल व फोल्डर बनाना, नाम बदलना, मूव, कॉपी और डिलीट करना",
      "सामान्य फाइल एक्सटेंशन्स: .txt, .odt, .ods, .odp, .pdf, .jpg, .zip, आदि",
    ],
  },
  {
    no: 3,
    titleEn: "Word Processing (LibreOffice Writer)",
    titleHi: "वर्ड प्रोसेसिंग (लिब्रेऑफिस राइटर)",
    hindiSub: "वर्ड प्रोसेसिंग (लिब्रेऑफिस राइटर)",
    theoryHours: 4,
    practicalHours: 8,
    descriptionEn: "Master document creation, text styling, paragraph formatting, tables, and mail merge in LibreOffice Writer.",
    descriptionHi: "लिब्रेऑफिस राइटर में डॉक्यूमेंट बनाना, टेक्स्ट फॉर्मेटिंग, टेबल और मेल मर्ज का कुशल उपयोग सीखें।",
    topicsEn: [
      "Word Processing Basics & Interface of LibreOffice Writer",
      "Opening, Creating, Editing, and Saving Documents (Save, Save As, Export to PDF)",
      "Text Manipulation: Selection, Cut, Copy, Paste, Find and Replace",
      "Text & Paragraph Formatting: Font Family, Size, Color, Alignment, Line Spacing, Bullets & Numbering",
      "Page Setup, Header & Footer, Page Numbers, Footnotes & Endnotes",
      "Table Manipulation: Inserting Tables, Adding/Deleting Rows & Columns, Cell Formatting, Borders & Shading",
      "Mail Merge: Creating Form Letters, Creating Address Lists, Merging and Printing Letters",
      "Keyboard Shortcuts & Print Preview",
    ],
    topicsHi: [
      "वर्ड प्रोसेसिंग की मूल बातें एवं लिब्रेऑफिस राइटर (LibreOffice Writer) का इंटरफेस",
      "डॉक्यूमेंट खोलना, नया बनाना, एडिट करना और सेव करना (Save, Save As, Export to PDF)",
      "टेक्स्ट मैनिपुलेशन: टेक्स्ट सेलेक्ट करना, कट, कॉपी, पेस्ट, फाइंड और रिप्लेस (Find & Replace)",
      "टेक्स्ट और पैराग्राफ फॉर्मेटिंग: फॉन्ट, साइज, कलर, अलाइनमेंट, लाइन स्पेसिंग, बुलेट्स और नंबरिंग",
      "पेज सेटअप, हेडर और फुटर, पेज नंबर, फुटनोट और एंडनोट",
      "टेबल मैनिपुलेशन: टेबल इन्सर्ट करना, रो/कॉलम जोड़ना व हटाना, सेल फॉर्मेटिंग, बॉर्डर और शेडिंग",
      "मेल मर्ज (Mail Merge): फॉर्म लेटर बनाना, एड्रेस लिस्ट तैयार करना, मर्ज और प्रिंट करना",
      "महत्वपूर्ण कीबोर्ड शॉर्टकट्स एवं प्रिंट प्रीव्यू",
    ],
  },
  {
    no: 4,
    titleEn: "Spreadsheet (LibreOffice Calc)",
    titleHi: "स्प्रेडशीट (लिब्रेऑफिस कैल्क)",
    hindiSub: "स्प्रेडशीट (लिब्रेऑफिस कैल्क)",
    theoryHours: 4,
    practicalHours: 8,
    descriptionEn: "Learn data entry, mathematical formulas, essential statistical functions, sorting, filtering, and charts in LibreOffice Calc.",
    descriptionHi: "लिब्रेऑफिस कैल्क में डेटा एंट्री, गणितीय फॉर्मूले, मुख्य स्टैटिस्टिकल फंक्शन्स, सॉर्टिंग, फिल्टरिंग और चार्ट्स सीखें।",
    topicsEn: [
      "Elements of Electronic Spreadsheet & Interface of LibreOffice Calc",
      "Rows, Columns, Cells, Cell Addresses, and Range Selection",
      "Entering and Editing Data: Text, Numbers, Dates, and AutoFill Series",
      "Inserting and Deleting Rows/Columns, Adjusting Column Width and Row Height",
      "Formulas and Mathematical Operators (+, -, *, /, %)",
      "Standard Functions: SUM, AVERAGE, COUNT, MAX, MIN, ROUND, IF (Logical Function)",
      "Data Sorting, AutoFilter, and Standard Filter",
      "Creating and Customizing Charts: Bar Chart, Column Chart, Pie Chart, Line Chart",
      "Page Setup, Sheet Protection, and Printing Spreadsheets",
    ],
    topicsHi: [
      "इलेक्ट्रॉनिक स्प्रेडशीट की मूल बातें एवं लिब्रेऑफिस कैल्क (LibreOffice Calc) का इंटरफेस",
      "रो (Rows), कॉलम (Columns), सेल (Cells), सेल एड्रेस और रेंज सिलेक्शन",
      "डेटा एंट्री एवं एडिटिंग: टेक्स्ट, नंबर्स, डेट और ऑटोफिल (AutoFill) सीरीज",
      "रो और कॉलम इन्सर्ट/डिलीट करना, कॉलम की चौड़ाई और रो की ऊंचाई एडजस्ट करना",
      "फॉर्मूले और गणितीय ऑपरेटर (+, -, *, /, %)",
      "मुख्य फंक्शन्स: SUM, AVERAGE, COUNT, MAX, MIN, ROUND, IF (लॉजिकल फंक्शन)",
      "डेटा सॉर्टिंग (Sorting), ऑटोफिल्टर और स्टैंडर्ड फिल्टर",
      "चार्ट बनाना एवं कस्टमाइज करना: बार चार्ट, कॉलम चार्ट, पाई चार्ट, लाइन चार्ट",
      "पेज सेटअप, शीट प्रोटेक्शन और स्प्रेडशीट प्रिंटिंग",
    ],
  },
  {
    no: 5,
    titleEn: "Presentation (LibreOffice Impress)",
    titleHi: "प्रस्तुतीकरण (लिब्रेऑफिस इम्प्रेस)",
    hindiSub: "प्रस्तुतीकरण (लिब्रेऑफिस इम्प्रेस)",
    theoryHours: 4,
    practicalHours: 8,
    descriptionEn: "Design engaging presentations with slide layouts, themes, animation effects, slide transitions, and slideshow controls.",
    descriptionHi: "स्लाइड लेआउट, थीम्स, एनिमेशन इफेक्ट्स, स्लाइड ट्रांज़िशन और स्लाइड शो कंट्रोल्स के साथ आकर्षक प्रेजेंटेशन बनाएं।",
    topicsEn: [
      "Basics of Presentation & Interface of LibreOffice Impress",
      "Creating New Presentations, Selecting Slide Layouts, and Slide Masters",
      "Adding, Duplicating, Moving, Hiding, and Deleting Slides",
      "Inserting Text Boxes, Images, Shapes, Audio, Video, and Tables",
      "Slide Formatting: Background Colors, Gradients, and Templates",
      "Applying Slide Transitions and Custom Object Animations",
      "Setting Slide Timings and Controlling Slide Shows",
      "Printing Handouts, Notes, and Slide Outlines",
    ],
    topicsHi: [
      "प्रेजेंटेशन की मूल बातें एवं लिब्रेऑफिस इम्प्रेस (LibreOffice Impress) का इंटरफेस",
      "नई प्रेजेंटेशन बनाना, स्लाइड लेआउट चुनना और मास्टर स्लाइड (Master Slide) का उपयोग",
      "स्लाइड जोड़ना, डुप्लीकेट करना, मूव करना, छिपाना (Hide) और डिलीट करना",
      "टेक्स्ट बॉक्स, इमेजेस, शेप्स, ऑडियो, वीडियो और टेबल इन्सर्ट करना",
      "स्लाइड फॉर्मेटिंग: बैकग्राउंड कलर्स, ग्रेडिएंट्स और थीम्स/टेम्पलेट्स",
      "स्लाइड ट्रांज़िशन (Transitions) और ऑब्जेक्ट कस्टम एनिमेशन (Animation) लगाना",
      "स्लाइड टाइमिंग सेट करना और स्लाइड शो रन/कंट्रोल करना",
      "हैंडआउट्स (Handouts), नोट्स और आउटलाइन प्रिंट करना",
    ],
  },
  {
    no: 6,
    titleEn: "Introduction to Internet and WWW",
    titleHi: "इंटरनेट और WWW का परिचय",
    hindiSub: "इंटरनेट और WWW का परिचय",
    theoryHours: 3,
    practicalHours: 6,
    descriptionEn: "Understand computer networks, IP addressing, web browsers, search engines, URLs, and internet protocols.",
    descriptionHi: "कम्प्यूटर नेटवर्क, IP एड्रेसिंग, वेब ब्राउज़र्स, सर्च इंजन, URL और इंटरनेट प्रोटोकॉल्स को समझें।",
    topicsEn: [
      "Basics of Computer Networks: LAN, MAN, WAN, and Network Topologies",
      "Concept of Internet, Architecture, and World Wide Web (WWW)",
      "Internet Access: Broadband, Dial-up, Wi-Fi, Hotspot, Mobile Data (4G/5G)",
      "Internet Protocols: TCP/IP, HTTP, HTTPS, FTP, DNS, SMTP, POP3",
      "IP Address (IPv4 & IPv6), MAC Address, and Domain Name System (DNS)",
      "Popular Web Browsers: Google Chrome, Mozilla Firefox, Microsoft Edge, Brave",
      "Search Engines (Google, Bing, Yahoo) & Advanced Web Search Techniques",
      "Downloading and Uploading Files from the Web",
    ],
    topicsHi: [
      "कम्प्यूटर नेटवर्क की मूल बातें: LAN, MAN, WAN और नेटवर्क टोपोलॉजी",
      "इंटरनेट की अवधारणा, आर्किटेक्चर और वर्ल्ड वाइड वेब (WWW)",
      "इंटरनेट कनेक्टिविटी: ब्रॉडबैंड, डायल-अप, वाई-फाई (Wi-Fi), हॉटस्पॉट, मोबाइल डेटा (4G/5G)",
      "इंटरनेट प्रोटोकॉल्स: TCP/IP, HTTP, HTTPS, FTP, DNS, SMTP, POP3",
      "IP एड्रेस (IPv4 एवं IPv6), MAC एड्रेस और डोमेन नेम सिस्टम (DNS)",
      "लोकप्रिय वेब ब्राउज़र्स: गूगल क्रोम, मोज़िला फ़ायरफ़ॉक्स, माइक्रोसॉफ्ट एज, ब्रेव",
      "सर्च इंजन (Google, Bing, Yahoo) एवं उन्नत वेब सर्च तकनीकें",
      "वेब से फाइल डाउनलोड और अपलोड करना",
    ],
  },
  {
    no: 7,
    titleEn: "E-mail, Social Networking & e-Governance Services",
    titleHi: "ई-मेल, सोशल नेटवर्किंग और ई-गवर्नेंस सेवाएं",
    hindiSub: "ई-मेल, सोशल नेटवर्किंग और ई-गवर्नेंस सेवाएं",
    theoryHours: 3,
    practicalHours: 6,
    descriptionEn: "Explore email communication, social media etiquette, instant messaging, and key Indian e-Governance portals.",
    descriptionHi: "ई-मेल संचार, सोशल मीडिया, इंस्टेंट मैसेजिंग और प्रमुख भारतीय ई-गवर्नेंस पोर्टल्स का उपयोग सीखें।",
    topicsEn: [
      "Structure of Email Address & Anatomy of an Email Message",
      "Using Email: Creating Account, Composing, CC & BCC, Replying, Forwarding, Attachments",
      "Email Management: Inbox, Sent, Drafts, Spam/Trash, Contacts, and Netiquette",
      "Social Networking & Microblogging: Facebook, X (Twitter), LinkedIn, Instagram",
      "Instant Messaging Apps: WhatsApp, Telegram, Signal",
      "Overview of e-Governance Services in India (Digital India Initiative)",
      "UMANG App, DigiLocker, Passport Seva, National Scholarship Portal (NSP)",
      "Online Railway & Bus Reservation (IRCTC), Utility Bill Payments",
    ],
    topicsHi: [
      "ई-मेल एड्रेस की संरचना और ई-मेल मैसेज का ढांचा (Anatomy)",
      "ई-मेल का उपयोग: अकाउंट बनाना, कंपोज़ करना, CC और BCC, रिप्लाई, फॉरवर्ड और अटैचमेंट्स",
      "ई-मेल प्रबंधन: इनबॉक्स, सेंट, ड्राफ्ट्स, स्पैम/ट्रैश, कॉन्टैक्ट्स और नेटिकेट (Netiquette)",
      "सोशल नेटवर्किंग और माइक्रोब्लॉगिंग: फेसबुक, एक्स (Twitter), लिंक्डइन, इंस्टाग्राम",
      "इंस्टेंट मैसेजिंग ऐप्स: व्हाट्सएप, टेलीग्राम, सिग्नल",
      "भारत में ई-गवर्नेंस सेवाओं का अवलोकन (डिजिटल इंडिया पहल)",
      "उमंग ऐप (UMANG), डिजिलॉकर (DigiLocker), पासपोर्ट सेवा, नेशनल स्कॉलरशिप पोर्टल (NSP)",
      "ऑनलाइन रेलवे और बस रिजर्वेशन (IRCTC), बिजली/पानी बिल भुगतान",
    ],
  },
  {
    no: 8,
    titleEn: "Digital Financial Tools and Applications",
    titleHi: "डिजिटल वित्तीय उपकरण और अनुप्रयोग",
    hindiSub: "डिजिटल वित्तीय उपकरण और अनुप्रयोग",
    theoryHours: 2,
    practicalHours: 4,
    descriptionEn: "Master cashless digital payment systems, UPI, QR codes, net banking, cards, and government financial security schemes.",
    descriptionHi: "कैशलेस डिजिटल भुगतान प्रणालियां, UPI, QR कोड, नेट बैंकिंग, डेबिट/क्रेडिट कार्ड और सरकारी वित्तीय सुरक्षा योजनाएं सीखें।",
    topicsEn: [
      "Why Digital Payments? Benefits and Precautions",
      "Digital Financial Tools: OTP (One Time Password), PIN, and QR Codes",
      "UPI (Unified Payments Interface) & Popular UPI Apps (BHIM, Google Pay, PhonePe, Paytm)",
      "AEPS (Aadhaar Enabled Payment System) & Micro-ATMs",
      "USSD (*99#) Banking without Internet",
      "Cards: Debit Cards, Credit Cards, Prepaid Cards, and RuPay Scheme",
      "e-Wallets (Prepaid Payment Instruments)",
      "PoS (Point of Sale) Terminals: Traditional, Mobile PoS, Soft PoS",
      "Internet Banking: NEFT, RTGS, IMPS, and Electronic Fund Transfers",
      "Government Financial Schemes: PMJDY, PMJJBY, PMSBY, Atal Pension Yojana (APY)",
    ],
    topicsHi: [
      "डिजिटल भुगतान के लाभ एवं सावधानियां",
      "डिजिटल वित्तीय उपकरण: OTP (वन टाइम पासवर्ड), PIN और QR कोड",
      "UPI (यूनिफाइड पेमेंट्स इंटरफेस) एवं लोकप्रिय UPI ऐप्स (BHIM, Google Pay, PhonePe, Paytm)",
      "AEPS (आधार इनेबल्ड पेमेंट सिस्टम) एवं माइक्रो-एटीएम",
      "USSD (*99#) बिना इंटरनेट मोबाइल बैंकिंग",
      "कार्ड्स: डेबिट कार्ड, क्रेडिट कार्ड, प्रीपेड कार्ड और RuPay कार्ड",
      "ई-वॉलेट्स (Prepaid Payment Instruments)",
      "PoS (पॉइंट ऑफ सेल) टर्मिनल्स: ट्रेडिशनल, मोबाइल PoS, सॉफ्ट PoS",
      "इंटरनेट बैंकिंग: NEFT, RTGS, IMPS और इलेक्ट्रॉनिक फंड ट्रांसफर",
      "सरकारी वित्तीय योजनाएं: PMJDY (जन धन योजना), PMJJBY, PMSBY, अटल पेंशन योजना (APY)",
    ],
  },
  {
    no: 9,
    titleEn: "Overview of Cyber Security",
    titleHi: "साइबर सुरक्षा का अवलोकन",
    hindiSub: "साइबर सुरक्षा का अवलोकन",
    theoryHours: 2,
    practicalHours: 4,
    descriptionEn: "Learn to identify cyber threats, malware types, strong password hygiene, two-factor authentication, and safe browsing habits.",
    descriptionHi: "साइबर खतरों, मैलवेयर प्रकारों, मजबूत पासवर्ड प्रबंधन, टू-फैक्टर ऑथेंटिकेशन और सुरक्षित ब्राउज़िंग की पहचान करना सीखें।",
    topicsEn: [
      "Introduction to Cyber Security & Need for Information Security",
      "Types of Cyber Threats & Malware: Viruses, Worms, Trojan Horses, Ransomware, Spyware, Adware",
      "Securing PC & Smartphone: Antivirus Software, Firewalls, Regular System Updates",
      "Safe Internet Browsing, Cookie Management, and Secure HTTPS Connections",
      "Password Hygiene: Creating Strong Passwords & Two-Factor Authentication (2FA)",
      "Identifying Online Fraud, Phishing Emails, Fake Websites, and Scam Calls",
      "Basics of Information Technology Act, 2000 (IT Act) & Cyber Crime Reporting (cybercrime.gov.in)",
    ],
    topicsHi: [
      "साइबर सुरक्षा का परिचय एवं सूचना सुरक्षा की आवश्यकता",
      "साइबर खतरों और मैलवेयर के प्रकार: वायरस, वॉर्म्स, ट्रोजन हॉर्स, रैनसमवेयर, स्पाइवेयर, एडवेयर",
      "PC और स्मार्टफोन को सुरक्षित करना: एंटीवायरस सॉफ्टवेयर, फायरवॉल, नियमित सिस्टम अपडेट",
      "सुरक्षित इंटरनेट ब्राउज़िंग, कुकीज़ प्रबंधन और सुरक्षित HTTPS कनेक्शन",
      "पासवर्ड हाइजीन: मजबूत पासवर्ड बनाना एवं टू-फैक्टर ऑथेंटिकेशन (2FA)",
      "ऑनलाइन फ्रॉड, फ़िशिंग ई-मेल, फेक वेबसाइट और स्कैम कॉल्स की पहचान",
      "सूचना प्रौद्योगिकी अधिनियम 2000 (IT Act) एवं साइबर क्राइम रिपोर्टिंग (cybercrime.gov.in)",
    ],
  },
  {
    no: 10,
    titleEn: "Introduction to Future Skills",
    titleHi: "भविष्य के कौशल (Future Skills) का परिचय",
    hindiSub: "भविष्य के कौशल (Future Skills) का परिचय",
    theoryHours: 2,
    practicalHours: 4,
    descriptionEn: "Get introduced to emerging exponential technologies shaping the global digital economy.",
    descriptionHi: "वैश्विक डिजिटल अर्थव्यवस्था को आकार देने वाली आधुनिक इमर्जिंग तकनीकों का परिचय प्राप्त करें।",
    topicsEn: [
      "Overview of Future Skills & Industry 4.0",
      "Internet of Things (IoT) & Smart Devices",
      "Big Data Analytics & Cloud Computing (IaaS, PaaS, SaaS)",
      "Virtual Reality (VR) & Augmented Reality (AR)",
      "Artificial Intelligence (AI) & Machine Learning (ML) Concepts",
      "Blockchain Technology & Distributed Ledgers",
      "3D Printing & Additive Manufacturing",
      "Robotics & Robotic Process Automation (RPA)",
    ],
    topicsHi: [
      "फ्यूचर स्किल्स एवं इंडस्ट्री 4.0 का अवलोकन",
      "इंटरनेट ऑफ थिंग्स (IoT) एवं स्मार्ट डिवाइसेज",
      "बिग डेटा एनालिटिक्स एवं क्लाउड कम्प्यूटिंग (IaaS, PaaS, SaaS)",
      "वर्चुअल रियलिटी (VR) एवं ऑगमेंटेड रियलिटी (AR)",
      "आर्टिफिशियल इंटेलिजेंस (AI) एवं मशीन लर्निंग (ML) की अवधारणाएं",
      "ब्लॉकचेन टेक्नोलॉजी एवं डिस्ट्रीब्यूटेड लेजर्स",
      "3D प्रिंटिंग एवं एडिटिव मैन्युफैक्चरिंग",
      "रोबोटिक्स एवं रोबोटिक प्रोसेस ऑटोमेशन (RPA)",
    ],
  },
];

export function SyllabusChaptersSection() {
  const [lang, setLang] = useState<"en" | "hi">("en");

  const totalTheory = REVISED_SYLLABUS_DATA.reduce(
    (acc, c) => acc + c.theoryHours,
    0
  );
  const totalPractical = REVISED_SYLLABUS_DATA.reduce(
    (acc, c) => acc + c.practicalHours,
    0
  );

  return (
    <div className="mb-12">
      {/* ── Section Header with Language Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 rounded-2xl bg-surface border border-border">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary">
            {lang === "hi"
              ? "अध्याय-वार संशोधित पाठ्यक्रम (10 मॉड्यूल्स)"
              : "Chapter-wise Revised Syllabus (10 Modules)"}
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            {lang === "hi"
              ? "प्रत्येक अध्याय पर क्लिक करके सभी मुख्य विषय व घंटे देखें।"
              : "Click any chapter to view detailed topics and hour breakdown."}
          </p>
        </div>

        {/* Language Toggle Pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex items-center p-1 rounded-xl bg-surface-elevated border border-border shadow-inner">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                lang === "en"
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <span>English</span>
            </button>
            <button
              type="button"
              onClick={() => setLang("hi")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${
                lang === "hi"
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <span>हिंदी (Hindi)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hours Summary Tag */}
      <div className="flex items-center justify-between text-xs text-text-muted mb-4 px-1">
        <span>
          {lang === "hi"
            ? `कुल समय: ${totalTheory} घंटे थ्योरी + ${totalPractical} घंटे प्रैक्टिकल = 90 घंटे`
            : `Total Duration: ${totalTheory}h Theory + ${totalPractical}h Practical = 90 Hours`}
        </span>
        <span className="hidden sm:inline-block font-medium">
          {lang === "hi" ? "भाषा: हिंदी" : "Language: English"}
        </span>
      </div>

      {/* ── Chapters Accordion List ── */}
      <div className="space-y-4">
        {REVISED_SYLLABUS_DATA.map((chapter) => {
          const title = lang === "hi" ? chapter.titleHi : chapter.titleEn;
          const subTitle = lang === "hi" ? chapter.titleEn : chapter.hindiSub;
          const description =
            lang === "hi" ? chapter.descriptionHi : chapter.descriptionEn;
          const topics = lang === "hi" ? chapter.topicsHi : chapter.topicsEn;

          return (
            <details
              key={chapter.no}
              className="group card rounded-2xl overflow-hidden border border-border transition-all open:shadow-card open:border-primary-400/40"
            >
              <summary className="flex items-center gap-4 p-5 cursor-pointer list-none select-none hover:bg-surface-elevated transition-colors">
                {/* Chapter number bubble */}
                <span className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 group-open:bg-primary-600 group-open:text-white flex items-center justify-center text-sm font-black shrink-0 transition-colors">
                  {chapter.no}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-base sm:text-lg text-text-primary group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-md bg-surface-elevated border border-border-subtle text-text-muted font-medium">
                      {chapter.theoryHours}h Th + {chapter.practicalHours}h Pr
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                    {subTitle}
                  </p>
                </div>

                <span className="text-text-muted group-open:rotate-45 group-open:text-primary-600 transition-transform text-xl font-bold px-2">
                  +
                </span>
              </summary>

              <div className="px-5 pb-6 pt-2 border-t border-border-subtle/60 bg-surface/50">
                <p className="text-xs sm:text-sm text-text-secondary italic mb-4 leading-relaxed">
                  {description}
                </p>

                <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                  {lang === "hi"
                    ? "मुख्य विषय एवं उप-विषय (Topics):"
                    : "Subtopics & Key Concepts:"}
                </h4>

                <ul className="grid grid-cols-1 gap-2.5">
                  {topics.map((topic, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>

                {/* Practice Shortcut for this topic */}
                <div className="mt-5 pt-3 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xs">
                  <span className="text-text-muted">
                    {lang === "hi"
                      ? "इस अध्याय पर आधारित प्रश्न हल करें:"
                      : "Need practice questions on this chapter?"}
                  </span>
                  <Link
                    href="/tests"
                    className="font-semibold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
                  >
                    {lang === "hi"
                      ? `अध्याय ${chapter.no} के टेस्ट लगाएं →`
                      : `Practice Chapter ${chapter.no} Questions →`}
                  </Link>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
