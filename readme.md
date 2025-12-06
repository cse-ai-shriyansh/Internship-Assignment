# THE STEPS TO RUN THE FLOW OF PROJECT
**STEP-1**
- Clone the repository to your local device or download the zipfile and extract it
# ANSWERS TO THE QUESTIONS Section 1 , and Section 2
## STEP-2
- open your supabase project(or make a new one), 
- then copy the queries present in the folder named **section_1.sql**  , 
- run it in your supabase sql editor console , after that , 
- do the same for the queries present in the folder named **section_2.sql** in dfferent query window for row level security policies.
## STEP-3
- now go to the supabase edge functions tab and Enter the Actual credentials in **"SUPABASE_URL"** and **"SUPABASE_SERVICE_ROLE_KEY"** in the file **Section_3_Edge_functions.ts** 
-now deploy the edge function by clicking on the deploy button.
- ***Do not forget to paste it in place of index.ts or the first console comes when you open Edge functions "DO NOT CREATE A NEW FILE"***
## STEP-4
- now in folder named**section4** create a file named **.env.local** and enter your supabase credentials in it.
- than go to the terminal and run the command **npm install** to install all the dependencies present in the **package.json** file.
## STEP-5
- now run the command **npm run dev** to start the development server and open the localhost link in your browser to see the application running.
