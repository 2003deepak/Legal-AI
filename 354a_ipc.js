import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

// Initialize Google GenAI with API key
const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });
const OUTPUT_FOLDER = path.join(process.cwd(), "case_outputs_ipc_354a");

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_FOLDER)) {
    fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
}

// List of IPC Section 302 cases for analysis
const section_354a_cases = [
    "Amit @ Lalu vs State (2017)",
    "State vs Vijay Kumar (2018)",
    "Rakesh Kumar K. v. State Of Kerala (2020)",
    "Kulwinder Singh v. State of Punjab and Another (2023)",
    "Madan v. State of Rajasthan (2023)",
    "Anoop Mathew v. The State of Kerala (2022)",
    "John v. State of Karnataka (2020)",
    "Sonu v. State & Ors. (2024)",
    "Sanjeev Singh v. State of Punjab (2022)",
    "Sri Lokesh v. State of Karnataka (2024)",
    "Mable George v. State of Kerala (2019)",
    "State of Kerala v. [Name Redacted] (2022)",
    "Chandra Shekhar v. State (2017)",
    "Ravinder @ Julie vs The State (2020)",
    "Saddak Hussain vs State (NCT Of Delhi) (2019)",
    "C. Mangesh & Ors v. State of Karnataka (2010)",
    "Kans Raj v. State of Punjab (2000)",
    "Sushil Kumar Sharma v. Union of India (2005)",
    "Preeti Gupta v. State of Jharkhand (2010)",
    "Arnesh Kumar v. State of Bihar (2014)",
    "Bachan Singh v. State of Punjab (1980)",
    "Machhi Singh & Ors v. State of Punjab (1983)",
    "Ruchika Girhotra case (1990)",
    "T. Manikadan v. State (2017)",
    "State of Punjab v. Major Singh (1966)",
    "Vikram Johar v. State of Uttar Pradesh (2019)",
    "State of Maharashtra v. Madhukar Narayan Mardikar (1991)",
    "Sakshi v. Union of India (2004)",
    "State of Punjab v. Gurmit Singh (1996)",
    "State of Haryana v. Bhagirath (1999)",
    "State of Karnataka v. Krishnappa (2000)",
    "State of Rajasthan v. Om Prakash (2002)",
    "State of U.P. v. Pappu (2005)",
    "State of M.P. v. Babulal (2008)",
    "State of Tamil Nadu v. Ravi (2006)",
    "State of Gujarat v. Anirudhsing (1997)",
    "State of Kerala v. Hamsa (1988)",
    "State of Bihar v. Deokaran Nenshi (1972)",
    "State of Andhra Pradesh v. Rayavarapu Punnayya (1976)",
    "State of West Bengal v. Orilal Jaiswal (1994)",
    "State of Haryana v. Prem Chand (1990)",
    "State of Maharashtra v. Chandraprakash Kewalchand Jain (1990)",
    "State of Rajasthan v. Narayan (1992)",
    "State of Punjab v. Ramdev Singh (2003)",
    "State of Haryana v. Inder Singh (2002)",
    "State of Karnataka v. Yarappa Reddy (1999)",
    "State of Maharashtra v. Bharat Fakira Dhiwar (2002)",
    "State of U.P. v. Naresh (2011)"
]

// Enhanced legal analysis prompt
const legalAnalysisPrompt = (caseTitle) => `
You are an advanced legal analyst with expertise in Indian Penal Code (IPC) and criminal jurisprudence. 
Conduct a comprehensive analysis of the case: ${caseTitle} and generate output in the following strict JSON format:

{
  "case_id": "${caseTitle}",
  "facts": ["Chronological key facts from the case record"],
  "ipc_sections": ["All IPC sections involved in the case"],
  "prosecution_arguments": [
    {
      "argument": "Legal claim summary",
      "precedents": ["Supporting case laws"],
      "elements": ["IPC elements to prove"],
      "counter_arguments": [
        {
          "loophole": "Identified weakness",
          "supporting_precedents": ["Relevant cases"]
        }
      ]
    }
  ],
  "defense_arguments": [
    {
      "argument": "Defense strategy",
      "edge_cases": ["Jurisdictional/procedural nuances"],
      "precedents": ["Supporting cases"]
    }
  ],
  "judgment": {
    "outcome": "Predicted verdict",
    "reasoning": ["Analysis influencing outcome"],
    "cited_cases": ["All referenced precedents"]
  }
}

ANALYSIS INSTRUCTIONS:

1. Fact Extraction:
   - Extract exact dates, parties, locations, and sequence of events
   - Note evidentiary details (medical reports, witness statements)
   - Identify judicial observations from the judgment

2. Legal Analysis:
   - For each IPC section: list essential elements and how they apply
   - Compare with similar precedents (landmark and recent)
   - Highlight evidentiary gaps or strengths

3. Argument Construction:
   - Prosecution: Build strongest possible case with supporting precedents
   - Defense: Identify all possible technical and substantive defenses
   - For each argument, provide 2-3 relevant precedents

4. Judgment Prediction:
   - Consider judicial trends in similar cases
   - Weight the evidence objectively
   - Note any procedural irregularities

OUTPUT REQUIREMENTS:
- Strictly JSON format
- No speculative content - mark as "Insufficient data" if uncertain
- Minimum 3 precedents per argument
- Prioritize Supreme Court rulings over High Court cases

EXAMPLE STRUCTURE REFERENCE (Narendra Singh vs Rakesh Singh):
{
    "case_id": "102242046",
    "facts": [
      "Appellants tried under Sections 302/34, 304B/34, 498A, and 201 IPC",
      "Marriage between Narendra Singh (Appellant 2) and deceased Saroj on 10.02.1991",
      "On 25.05.1991, Saroj reported missing by Rakesh Singh (Appellant 3)",
      "Burnt unidentified female body found in forest same day",
      "Initial FIR under Sections 302/201 IPC",
      "Postmortem (26.05.1991) confirmed strangulation (ante-mortem) and post-mortem burns",
      "PW-1 (father) filed dowry complaint on 26.05.1991 alleging demands for TV/fridge/cooler",
      "Threats reported if demands unmet when taking Saroj back",
      "Body identified via clothes/jewelry by PW-1",
      "Prosecution alleged murder, evidence destruction via burning",
      "Charges framed under 304B/34, 302/34, 498A, 201 IPC + Dowry Prohibition Act",
      "Sessions Court acquitted all (identification issues, lack of dowry cruelty evidence)",
      "High Court reversed: convicted all under 304B/34, 498A, 201 IPC (7y+2y+1y concurrent)",
      "Appeal filed against HC judgment"
    ],
    "ipc_sections": [
      "Section 34",
      "Section 201",
      "Section 302",
      "Section 304B",
      "Section 498A",
      "Section 306 (Discussed)",
      "Section 300 (Discussed)",
      "Section 304 (Discussed)"
    ],
    "prosecution_arguments": [
      {
        "argument": "Trial court acquittal was perverse; HC justified in reversal",
        "precedents": ["Chandrappa v. State of Karnataka (2007) 4 SCC 415 on perverse acquittals"],
        "elements": ["Judicial perversity standards"],
        "counter_arguments": [
          {
            "loophole": "No clear demonstration of how trial court's evidence evaluation was irrational",
            "supporting_precedents": ["Ramesh Babulal Doshi v. State (1996) 9 SCC 225: Acquittal reversal requires glaring errors"]
          }
        ]
      },
      {
        "argument": "All Section 304B ingredients proven beyond doubt",
        "precedents": ["Iqbal Singh v. State (1991) 3 SCC 1 on 304B presumptions"],
        "elements": [
          "Death within 7 years",
          "Unnatural death (strangulation+burning)",
          "Dowry-linked cruelty",
          "Cruelty 'soon before death'"
        ],
        "counter_arguments": [
          {
            "loophole": "No medical evidence linking injuries to accused; burns were post-mortem",
            "supporting_precedents": ["Baljinder Kaur v. State (2014): Post-mortem burns weaken 304B case"]
          }
        ]
      },
      {
        "argument": "PW-1/PW-5/PW-6/PW-7 proved dowry demands/threats",
        "precedents": ["Shanti v. State (1991) 1 SCC 371 on parent testimony"],
        "elements": [
          "Witness credibility",
          "Dowry demand proof",
          "Cruelty establishment"
        ],
        "counter_arguments": [
          {
            "loophole": "PW-5/PW-6 were interested witnesses; no independent corroboration",
            "supporting_precedents": ["M. Narsinga Rao v. State (2001) 1 SCC 691: Interested witness testimony requires corroboration"]
          }
        ]
      },
      {
        "argument": "Burnt body location + false missing report prove Section 201 IPC",
        "precedents": ["K. Prakashan v. Surenderan (2008) 1 SCC 258 on evidence destruction"],
        "elements": [
          "Disappearance act",
          "Screening intention"
        ],
        "counter_arguments": [
          {
            "loophole": "No forensic proof that appellants transported body to forest",
            "supporting_precedents": ["Alamgir Sani v. State (2002) 10 SCC 277: Mere presence ≠ Section 201 guilt"]
          }
        ]
      }
    ],
    "defense_arguments": [
      {
        "argument": "HC cannot reverse acquittal merely because alternative view exists",
        "edge_cases": ["Appellate restraint principles under CrPC"],
        "precedents": ["Basappa v. State (2014) 5 SCC 154 on acquittal reversal thresholds"]
      },
      {
        "argument": "No proof of cruelty 'soon before death' for Section 304B",
        "edge_cases": ["Gap between last alleged demand (during second visit) and death"],
        "precedents": ["Bhim Singh v. State (2002) 10 SCC 461: 'Soon before' requires proximate nexus"]
      },
      {
        "argument": "Appellants 3-4's roles unsubstantiated",
        "edge_cases": ["Brother/brother-in-law liability under 498A without active participation"],
        "precedents": ["Ganpat v. State (2010) 12 SCC 59: Distant relatives need specific cruelty evidence"]
      },
      {
        "argument": "Prosecution failed to prove dowry demand was to deceased (only to parents)",
        "edge_cases": ["Whether demands to parents alone satisfy 304B without deceased's knowledge"],
        "precedents": ["Kallu v. State (2006) 10 SCC 313: Demand must relate to marital relationship"]
      }
    ],
    "judgment": {
      "outcome": "Partial acquittal: Appellants 1-2 convicted under 304B/34, 498A, 201 IPC; Appellants 3-4 acquitted",
      "reasoning": [
        "HC correctly identified trial court's perversity in ignoring PW-1's credible identification",
        "Section 113B presumption properly invoked against husband/father-in-law (Appellants 1-2)",
        "No evidence Appellants 3-4 participated in demands - benefit of doubt applied",
        "Procedural lapse under Section 235 CrPC harmless as minimum sentence given"
      ],
      "cited_cases": [
        "Iqbal Singh v. State (1991) 3 SCC 1",
        "Basappa v. State (2014) 5 SCC 154",
        "Ganpat v. State (2010) 12 SCC 59",
        "Muthu Kutty v. State (2005) 9 SCC 113",
        "Bhim Singh v. State (2002) 10 SCC 461"
      ]
    }
  }
`;

// Improved case analysis function with better error handling
async function analyzeCase(caseTitle) {
    try {
        const prompt = legalAnalysisPrompt(caseTitle);
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro-exp-03-25",  
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0.2,  // Lower for more factual accuracy
                topP: 0.85,
                topK: 30,
                maxOutputTokens: 4096,
                responseMimeType: "application/json"  // Explicitly request JSON output
            },
            safetySettings: [
                {
                    category: "HARM_CATEGORY_LEGAL",
                    threshold: "BLOCK_NONE"  // Ensure legal analysis isn't blocked
                }
            ]
        });

        // Validate and parse response
        let analysisData;
        try {
            let responseText = response.candidates[0]?.content?.parts[0]?.text || "";

            // Strip Markdown formatting (remove triple backticks and "json" keyword if present)
            responseText = responseText.replace(/^```json\s*/, "").replace(/```$/, "");

            if (!responseText.trim()) {
                throw new Error("Empty response from Gemini API");
            }

            if (!responseText) {
                throw new Error("Empty response from Gemini API");
            }

            analysisData = JSON.parse(responseText);
            
            // Enhanced validation
            if (!analysisData.case_id || !Array.isArray(analysisData.facts) || !analysisData.ipc_sections) {
                throw new Error("Invalid analysis structure received");
            }

            // Ensure all required fields exist
            analysisData.prosecution_arguments = analysisData.prosecution_arguments || [];
            analysisData.defense_arguments = analysisData.defense_arguments || [];
            analysisData.judgment = analysisData.judgment || {};

        } catch (parseError) {
            console.error(`Failed to parse response for ${caseTitle}:`, parseError);
            analysisData = {
                case_id: caseTitle,
                error: "Failed to parse legal analysis",
                raw_response: response.candidates[0]?.content?.parts[0]?.text || "No content",
                timestamp: new Date().toISOString()
            };
        }

        // Save to file with improved filename sanitization
        const sanitizedFilename = caseTitle
            .replace(/[^a-zA-Z0-9\s_-]/g, '')  // More strict sanitization
            .trim()
            .replace(/\s+/g, '_')
            .slice(0, 100);  // Limit filename length
        
        const filePath = path.join(OUTPUT_FOLDER, `${sanitizedFilename}_analysis_${Date.now()}.json`);
        
        fs.writeFileSync(
            filePath,
            JSON.stringify(analysisData, null, 2),
            { flag: 'wx', encoding: 'utf-8' }  // 'wx' fails if file exists
        );

        console.log(`Successfully analyzed and saved: ${filePath}`);
        return analysisData;

    } catch (error) {
        console.error(`Error analyzing case ${caseTitle}:`, error.message);
        
        // Enhanced error logging
        const errorData = {
            case_id: caseTitle,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            lastSuccessfulCase: section_354a_cases[section_354a_cases.indexOf(caseTitle) - 1] || null
        };
        
        const errorPath = path.join(OUTPUT_FOLDER, `error_${Date.now()}_${caseTitle.slice(0, 50).replace(/\s+/g, '_')}.json`);
        fs.writeFileSync(errorPath, JSON.stringify(errorData, null, 2));
        
        return null;
    }
}

// Batch processing with rate limiting
async function processAllCases() {
    const results = [];
    const BATCH_DELAY = 2000; // 2 seconds between requests
    
    for (const caseTitle of section_354a_cases) {
        try {
            console.log(`Processing case: ${caseTitle}`);
            const result = await analyzeCase(caseTitle);
            results.push(result);
            
            // Rate limiting
            if (section_354a_cases.indexOf(caseTitle) < section_354a_cases.length - 1) {
                await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
            }
        } catch (error) {
            console.error(`Fatal error processing ${caseTitle}:`, error);
        }
    }
    
    // Generate summary report
    const summary = {
        timestamp: new Date().toISOString(),
        total_cases: section_354a_cases.length,
        successful: results.filter(r => r && !r.error).length,
        failed: results.filter(r => !r || r.error).length,
        cases_processed: section_354a_cases
    };
    
    fs.writeFileSync(
        path.join(OUTPUT_FOLDER, 'analysis_summary.json'),
        JSON.stringify(summary, null, 2)
    );
    
    console.log('Analysis completed. Summary:', summary);
    return results;
}

// Execute with proper error handling
(async () => {
    try {
        await processAllCases();
    } catch (error) {
        console.error('Fatal error in main execution:', error);
        process.exit(1);
    }
})();