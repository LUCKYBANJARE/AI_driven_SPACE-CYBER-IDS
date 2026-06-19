/* =========================================================
   REAL-TIME SATELLITE API TEST
   RUN THIS FILE SEPARATELY
   =========================================================

   SAVE AS:
   api_test.js

   RUN:
   node api_test.js

   ========================================================= */


/* =========================================================
   FETCH BUILT-IN
   ========================================================= */

const fetch = global.fetch || require("node-fetch");


/* =========================================================
   LIVE CELESTRAK API
   ========================================================= */

const API_URL =
"https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=tle";


/* =========================================================
   MAIN FUNCTION
   ========================================================= */

async function testSatelliteAPI() {

    console.log("\n=================================");
    console.log("TESTING LIVE SATELLITE API");
    console.log("=================================\n");

    try {

        console.log("Fetching data...\n");

        const response =
            await fetch(API_URL);

        console.log(
            "HTTP STATUS:",
            response.status
        );

        if(!response.ok){

            throw new Error(
                "API Request Failed"
            );
        }

        const data =
            await response.text();

        console.log(
            "\nFETCH SUCCESSFUL\n"
        );

        /* =================================
           SPLIT TLE DATA
           ================================= */

        const lines =
            data
            .split("\n")
            .map(line => line.trim())
            .filter(line => line !== "");

        const totalSatellites =
            Math.floor(lines.length / 3);

        console.log(
            "TOTAL SATELLITES FETCHED:",
            totalSatellites
        );

        console.log(
            "\n================================="
        );

        console.log(
            "FIRST 5 SATELLITES"
        );

        console.log(
            "=================================\n"
        );

        /* =================================
           DISPLAY FIRST 5
           ================================= */

        for(let i=0; i<5; i++){

            const name =
                lines[i*3];

            const tle1 =
                lines[i*3 + 1];

            const tle2 =
                lines[i*3 + 2];

            console.log(
                "SATELLITE:",
                name
            );

            console.log(
                "TLE LINE 1:",
                tle1
            );

            console.log(
                "TLE LINE 2:",
                tle2
            );

            console.log(
                "---------------------------------\n"
            );
        }

        /* =================================
           FETCH SIZE
           ================================= */

        console.log(
            "TOTAL DATA SIZE:",
            (data.length / 1024).toFixed(2),
            "KB"
        );

        console.log(
            "\nAPI FETCH WORKING PERFECTLY\n"
        );

    } catch(error) {

        console.error(
            "\nERROR OCCURRED\n"
        );

        console.error(
            error.message
        );

        console.log(
            "\nPOSSIBLE REASONS:"
        );

        console.log(
            "1. No internet connection"
        );

        console.log(
            "2. API blocked"
        );

        console.log(
            "3. Node version too old"
        );

        console.log(
            "4. Firewall issue"
        );
    }
}


/* =========================================================
   RUN TEST
   ========================================================= */

testSatelliteAPI();
