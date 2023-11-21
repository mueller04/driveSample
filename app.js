var fs = require('fs'), filename = process.argv[2];

const parseInput = () => {

    const data = fs.readFileSync(filename, 'utf8') 
    
        const lines = data.split('\n');
      
        const partners = {};
        const companies = {};
      
        lines.forEach(line => {
      
          const words = line.split(' ')
      
          if (words[0] === 'Partner') {
              partners[words[1]] = [];
          } else if (words[0] === 'Company') {
              companies[words[1]] = {};
          } else if ((words[0] === 'Employee')) {
              if (!Array.isArray(companies[words[2]])) {
                  companies[words[2]] = []
              }
              companies[words[2]].push(words[1]);
          } else if ((words[0] === 'Contact')) {
              if (!Array.isArray(partners[words[2]])) {
                  partners[words[2]] = [];
              }
              if (words[3] === 'email' || words[3] === 'call' || words[3] === 'coffee') {
                partners[words[2]].push({"name": words[1], "type": words[3]});
              }
          }
        });

      return {partners, companies};
  }

  const createContactScores = (partners) => {
    for (const [key, value] of Object.entries(partners)) {
        const contactScore = {};
    
    
        value.forEach(v => {
    
            if (contactScore[v.name] === undefined) {
                contactScore[v.name] = 0;
            }
            contactScore[v.name]++;
        });
    
        partners[key].contactScores = contactScore;
      }
  }

 const calculateHighestContactScore = (partners) => {
  const highestContactScore = {}

  for (const [key, partnerValue] of Object.entries(partners)) {

    for (const [contactScoreKey, contactScoreValue] of Object.entries(partnerValue.contactScores)) {

        if (highestContactScore[contactScoreKey] === undefined) {
            highestContactScore[contactScoreKey] = {"partner": key, "score": contactScoreValue};
        }

        for (const [highestContactScoreKey, highestContactScoreValue] of Object.entries(highestContactScore)) {
            if (contactScoreValue > highestContactScore) {
                highestContactScore[contactScoreKey] = {"partner": key, "score": contactScoreValue};
            }
        }
    }
  }
  return highestContactScore;
 }

  const calculateCompanyRelationshipScores = (companies, highestContactScore) => {
    const companyRelationshipScores = {};

    for (var [key, employees] of Object.entries(companies)) {

        if (!Array.isArray(employees)) {
            employees = [];
        }
    
        employees.forEach(employee => {
            if (highestContactScore[employee] !== undefined) {
    
                if (companyRelationshipScores[key] === undefined) {
                    companyRelationshipScores[key] = highestContactScore[employee];
                } else {
                    companyRelationshipScores[key].score += highestContactScore[employee].score
                }
    
            }
    
        });
        if (employees === undefined || employees.length == 0) {
            companyRelationshipScores[key] = "No current relationship";
        }
      }
      return companyRelationshipScores;
  }

  const formatOutput = (companyRelationshipScores) => {
    const resultArray = []

    for (const [company, data] of Object.entries(companyRelationshipScores)) {
        if (typeof data === 'string') {
            resultArray.push(`${company}: ${data}\n`)
        } else {
            resultArray.push(`${company}: ${data.partner} (${data.score})\n`)
        }
    }

    return resultArray.sort().toString().replace(/,/g, '');
  }

    const {partners, companies} = parseInput();
    createContactScores(partners);
    /**result will be in format
    {
        Contact1: { partner: 'Partner1', score: 2 },
        Contact2: { partner: 'Partner2', score: 1 }
    }
    **/
    const highestContactScore = calculateHighestContactScore(partners)
    const companyRelationshipScores = calculateCompanyRelationshipScores(companies, highestContactScore);
    const formattedRelationshipScores = formatOutput(companyRelationshipScores);

  console.log(formattedRelationshipScores);

