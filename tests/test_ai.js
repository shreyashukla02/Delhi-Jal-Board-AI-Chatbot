require('dotenv').config();
const { analyzeComplaint } = require('../src/services/aiService');

async function runTest(testName, input, currentData = {}) {
  console.log(`\n🧪 TEST: ${testName}`);
  console.log(`   Input: "${input}"`);
  console.log(`   Context: ${JSON.stringify(currentData)}`);
  
  const start = Date.now();
  const result = await analyzeComplaint(input, currentData);
  const duration = Date.now() - start;

  if (!result) {
    console.log("   ❌ FAILED: Result is null");
    return null;
  }

  console.log(`   ✅ Result (${duration}ms):`);
  console.log(`      - Issue: ${result.extractedData.issue}`);
  console.log(`      - Category: ${result.extractedData.category} > ${result.extractedData.subCategory}`);
  console.log(`      - Missing: ${!result.extractedData.name ? 'Name ' : ''}${!result.extractedData.mobile ? 'Mobile ' : ''}${!result.extractedData.address ? 'Address ' : ''}`);
  console.log(`      - Complete: ${result.isComplete}`);
  console.log(`      - Next Q: "${result.nextQuestion}"`);
  return result;
}

async function testSuite() {
  console.log("==========================================");
  console.log("🤖 AI SERVICE ROBUSTNESS TEST SUITE");
  console.log("==========================================");

  // 1. Happy Path: Full CRM Complaint
  await runTest(
    "Full CRM Complaint", 
    "Hi, I am Amit Kumar, 9988776655. There is a sewer overflow in front of House 123, Block B, Janakpuri.", 
    {}
  );

  // 2. Happy Path: Full RMS Complaint
  await runTest(
    "Full RMS Complaint", 
    "My bill is wrong. Name: Priya, Phone: 9876543210, Address: Flat 404, Dwarka Sec 10.", 
    {}
  );

  // 3. Conversational Flow (Step-by-Step)
  console.log("\n🔄 SCENARIO: Conversational Flow");
  
  // Step 1: User states issue only
  let context = {};
  let res = await runTest("Step 1: Issue Only", "Ganda paani aa raha hai subah se.", context);
  
  if (res) {
    // Update context with extracted data
    context = res.extractedData;
    
    // Step 2: User provides Name & Mobile
    res = await runTest("Step 2: Name & Mobile", "Mera naam Rahul hai, number 9090909090.", context);
    
    if (res) {
      context = res.extractedData;
      
      // Step 3: User provides Address
      res = await runTest("Step 3: Address", "Address is H.No 55, Karol Bagh.", context);
    }
  }

  // 4. Hindi/Hinglish Test
  await runTest(
    "Hinglish Complaint", 
    "Bhaiya gali number 4, Laxmi Nagar me gutter ka dhakkan tuta hua hai. Jaldi fix karao. Name: Suresh, 8888888888", 
    {}
  );

  // 5. Vague Input
  await runTest(
    "Vague Input", 
    "Paani nahi hai", 
    {}
  );

  // 6. Context Retention Check
  // Ensure that if we pass existing data, it is not lost even if the new input doesn't mention it
  await runTest(
    "Context Retention", 
    "Address is Block C, Pitampura", 
    { name: "Existing Name", mobile: "1234567890", issue: "No Water" }
  );

  console.log("\n==========================================");
  console.log("✅ Test Suite Completed");
  console.log("==========================================");
}

testSuite();