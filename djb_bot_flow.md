# Delhi Jal Board WhatsApp Grievance Bot Flow

## Format Convention
**Bot Statement** (in normal text)  
`<Expected Customer Response>` (in angle brackets)

---

## 1. Language Selection

**Bot:**
> Dear customer, please select your language. {Hindi/English}  
> प्रिय ग्राहक, कृपया अपनी भाषा चुनें। {हिन्दी/अंग्रेज़ी}

`<English>` or `<हिन्दी>`

---

# English Flow

## 2. Welcome & Main Menu

**Bot:**
> Welcome to Delhi Jal Board query assistance. Do you want to register a new grievance or want updates on a previously registered grievance?
> 1. Enter new grievance
> 2. View grievance status

`<1. Register new complaint>` or `<2. View grievance status>`

---

## 3A. Register New Complaint

### Step 1: Personal Details

**Bot:**
> Please enter the following details:
> - Your name
> - Mobile no.
> - Email address
> - Your address

### Step 2: Grievance Address

**Bot:**
> Enter the address of the grievance.  
> (Address format - House No./Block/Gali No./Colony Name/Landmark/Delhi/Pincode)

### Step 3: Category Selection

**Bot:**
> Select the category of your grievance:
> - Water Supply/Sewer Related (CRM)
> - Revenue/Bills Related (RMS)

`<CRM>` or `<RMS>`

---

## 4. CRM - Sub-Category Selection

**Bot:**
> Select a sub-category for your complaint:
> 1. Sewer
> 2. Water Supply
> 3. Tanker
> 4. Water Logging
> 5. None of the above, take me to RMS complaints options

---

### 4.1. Sewer Complaints

**Bot:**
> - Missing of Manhole Cover
> - Pits on Road Sewer / Road Construction Sewer
> - Repairing Manhole Cover
> - Sewer Blockage / Overflow / Leakage
> - Sewer Garbage
> - Unauthorized Sewer Connection

---

### 4.2. Water Supply Complaints

**Bot:**
> - Dirty Water (Contamination)
> - Leakages in Water Pipeline
> - Low Water Pressure
> - No Water Supply
> - Pits on Road / Road Construction (water line related)
> - Short Water Supply
> - Unauthorized Water Connection
> - Wastage of Water

---

### 4.3. Tanker Complaints

**Bot:**
> - Water Tanker Required
> - Water Tanker – Missed Trip

---

### 4.4. Water Logging

**Bot:**
> - Water Logging

---

## 5. Grievance Description & Media Upload

**Bot:**
> Enter grievance description

**Bot:**
> Upload photos/videos related to the grievance, if available.

---

## 6. Confirmation

**Bot:**
> Your grievance has been registered successfully. You have been assigned the following grievance number through which you can access the progress of your complaint.
> 
> **Registered Grievance number: abcd1234**
> 
> Kindly save this number for checking in later.

---

## 3B. View Grievance Status

**Bot:**
> Please enter the registered grievance number.

`<abcd1234>`

**Bot Response (Option 1):**
> Your grievance status: Assigned to JE/AE {Name and Contact Details}

**Bot Response (Option 2):**
> It has been resolved successfully.

---

---

# हिन्दी फ्लो (Hindi Flow)

## 2. स्वागत और मुख्य मेनू

**बॉट:**
> दिल्ली जल बोर्ड प्रश्न सहायता में आपका स्वागत है। क्या आप नई शिकायत दर्ज करना चाहते हैं या पहले दर्ज की गई शिकायत की स्थिति जानना चाहते हैं?
> 1. नई शिकायत दर्ज करें
> 2. शिकायत की स्थिति देखें

`<1. नई शिकायत दर्ज करें>` या `<2. शिकायत की स्थिति देखें>`

---

## 3A. नई शिकायत दर्ज करें

### चरण 1: व्यक्तिगत विवरण

**बॉट:**
> कृपया निम्नलिखित विवरण दर्ज करें:
> - आपका नाम
> - मोबाइल नंबर
> - ईमेल पता
> - आपका पता

### चरण 2: शिकायत का पता

**बॉट:**
> शिकायत का पता दर्ज करें।  
> (पता प्रारूप - घर संख्या/ब्लॉक/गली संख्या/कॉलोनी का नाम/मुख्य चिन्ह/दिल्ली/पिनकोड)

### चरण 3: श्रेणी चयन

**बॉट:**
> अपनी शिकायत की श्रेणी चुनें:
> - पानी की आपूर्ति/सीवेर संबंधित (CRM)
> - राजस्व/बिल संबंधित (RMS)

`<CRM>` या `<RMS>`

---

## 4. CRM - उप-श्रेणी चयन

**बॉट:**
> अपनी शिकायत के लिए एक उप-श्रेणी चुनें:
> 1. सीवर
> 2. पानी की आपूर्ति
> 3. टैंकर
> 4. पानी भरना
> 5. उपरोक्त में से कोई नहीं, मुझे RMS शिकायत विकल्पों पर ले जाएँ

---

### 4.1. सीवर शिकायतें

**बॉट:**
> - मैनहोल कवर गायब
> - सड़कों पर गड्ढे / सड़क निर्माण सीवर
> - मैनहोल कवर की मरम्मत
> - सीवर में ब्लॉकेज / ओवरफ़्लो / लीकेज
> - सीवर कचरा
> - अनधिकृत सीवर कनेक्शन

---

### 4.2. जल आपूर्ति शिकायतें

**बॉट:**
> - गंदा पानी (प्रदूषण)
> - जल पाइपलाइन में रिसाव
> - कम पानी का दबाव
> - जल आपूर्ति नहीं
> - सड़क पर गड्ढे / सड़क निर्माण (जल लाइन से संबंधित)
> - सीमित जल आपूर्ति
> - अवैध जल कनेक्शन
> - पानी की बर्बादी

---

### 4.3. टैंकर शिकायतें

**बॉट:**
> - पानी का टैंकर आवश्यक
> - पानी का टैंकर – चूकी हुई यात्रा

---

### 4.4. जलभराव

**बॉट:**
> - जलभराव

---

## 5. शिकायत विवरण और मीडिया अपलोड

**बॉट:**
> शिकायत विवरण दर्ज करें।

**बॉट:**
> यदि उपलब्ध हों तो शिकायत से संबंधित फ़ोटो/वीडियो अपलोड करें।

---

## 6. पुष्टिकरण

**बॉट:**
> आपकी शिकायत सफलतापूर्वक दर्ज कर ली गई है। आपको निम्नलिखित शिकायत क्रमांक प्रदान किया गया है जिसके माध्यम से आप अपनी शिकायत की प्रगति की जांच कर सकते हैं।
> 
> **दर्ज की गई शिकायत क्रमांक: abcd1234**
> 
> कृपया इसे बाद में जांच करने के लिए सुरक्षित रखें।

---

## 3B. शिकायत की स्थिति देखें

**बॉट:**
> कृपया पंजीकृत शिकायत संख्या दर्ज करें।

`<abcd1234>`

**बॉट प्रतिक्रिया (विकल्प 1):**
> आपकी शिकायत की स्थिति: JE/AE {नाम और संपर्क विवरण} को सौंप दी गई है

**बॉट प्रतिक्रिया (विकल्प 2):**
> यह सफलतापूर्वक हल कर दी गई है।

---

## Notes

- **CRM** = Customer Relationship Management (Water Supply/Sewer Related)
- **RMS** = Revenue Management System (Bills Related)
- **JE** = Junior Engineer
- **AE** = Assistant Engineer