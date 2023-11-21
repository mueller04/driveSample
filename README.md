# Drive Sample

Drive Sample is a javascript command for generating a dataset of contact relations.

## Prerequisites

have node installed [nodejs](https://nodejs.org/en/download).

## Run

pull the source code from github onto your local

```bash
# run project
node app.js sample.txt

```

## How I approached the problem

First I setup the project and ensured it can read the text file, parse, and print the lines.

I wrote logic to parse all the data into categories, Partners with their Contacts as values, and Companies with their Employees as values.

I decided to add the missing data needed to derive the result, the count of the number of relations between each contact and partner.  I modified the Partner map to have an additional contactScores property with the value of an object with Contact name and score for that Partner.

I needed to calculate which Contact had the highest score across all partners so I created another map called highestContactScore with a key of Contact name so that each contact will only retain it's highest score and subsequent Partner name.

I used the highestContactScore map to iterate over the companies and use each companies Employee to accumulate which high score and subsequent Partner belongs to that company in the final results, I saved this to a map called companyRelationshipScores.  At this point I assigned the value "No current relationship" for any company which did not have an array value for Employees.

I made a formatOutput for final presentation formatting.

I generally wrote the logic imperatively and refactored it into single purpose functions.

## Assumptions

As I make the calculated highest contact score for each Partner, I only keep the current highest score, if I read another score which is lower or equal I do not keep that score.  So if there are two contacts with an equal number of relations with a Partner, only the first Contact is marked as the top contact for that Partner.

As I calculate the highest contact score for each Contact across all Partners, I only keep one version of the score for each Contact at a time, that being the highest one found.  I do this by keeping a new map where the key is the Contact for this score.  This means if a two or more Partners with an identical amount of relations with a Contact occurs, only the first Contact - Partner combination will be processed with that score and thus the final report will award the highest score to the first Partner which had that Contact relation score processed.

The challenge said I could assume that when an employee is declared, the company referenced would have been previously declared as well though I found it trivial to add a safeguard to capture additional companies here which may not have been declared before.

The test data as arranged is not sufficient to test the full requirements.  Adding the following lines will show improper results
Employee Foo Globex
Contact Foo Molly email
The fix for this would be to change calculateCompanyRelationshipScores
so that companyRelationshipScores is not Company -> {Partner, Score}
but rather Company -> Partner -> Score (map of map).
In this way, an intermediate calculated object could be made such as:
  Globex: { partner: 'Chris', score: 3 },
  Globex: { partner: 'Molly', score: 1 },
  ACME: 'No current relationship',
  Hooli: { partner: 'Molly', score: 1 }
And then this data would be reduced to only retain one distinct Company, that having the highest score, so this line would drop:
  Globex: { partner: 'Molly', score: 1 },

