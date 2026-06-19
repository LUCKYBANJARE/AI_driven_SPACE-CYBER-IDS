const telemetryPanel =
  document.getElementById("telemetry");

function updateTelemetry(data){

  telemetryPanel.innerHTML = `

  ACTIVE SATELLITES : ${data.satellites}<br>
  SPACE DEBRIS : ${data.debris}<br>
  THREATS : ${data.threats}<br>
  HIGH RISK OBJECTS : ${data.highRisk}<br>
  AI STATUS : ACTIVE<br>
  CYBER STATUS : SECURE

  `;

}