//button handler function
function generatePdf()
{
	initDroneDeployApi()
	.then(getCurrentlyViewedPlan)
	.then(getTileFromPlan)
	.then(getTileFromResponse)
	.then(postDataToServer)
	.then(generatePDF)
    .catch(console.log);
}

//initialize droneDeployApi
function initDroneDeployApi()
{	
	return new DroneDeploy({version: 1});
}
	
//Query api for currently viewed plan
function getCurrentlyViewedPlan(droneDeployApi)
{
	window.api = droneDeployApi;
	return window.api.Plans.getCurrentlyViewed();
}

//Based on plan id query tiles api
//hardcoded layerName and zoom
function getTileFromPlan(plan)
{
	return window.api.Tiles.get({planId: plan.id, layerName: 'ortho', zoom: 16});
}

//get tile array from response
function getTileFromResponse(res)
{
	return res.tiles;
}

//send tile data to server via POST
function postDataToServer(tiles) {
  const webServerUrl = 'https://dronedeployserver.herokuapp.com/getUrl/';
  const body = JSON.stringify({
    'tile': tiles
  });
  return fetch(webServerUrl, {
    method: 'POST',
    body: body
  })
    .then((res) => res.json())
    .then((rjson) => rjson.msg);
}

//using pdfmake to create pdf on client side.
function generatePDF(encodedTiles) {
  const docDefinition = generatePDFcontent(encodedTiles);
  pdfMake.createPdf(docDefinition).open();
}

function generatePDFcontent(list) {
  let content = [{ text: 'Akshay Sonvane', style: 'header' }];
  const contentStyle = {
    header: {
      fontSize: 14,
      bold: true
    }
  };
  for (let i = 0; i < list.length; i++) {
    content.push({
      image: `data:image/jpeg;base64,${list[i]}`
    });
  }
  return (
  {
    content: content,
    styles: contentStyle
  }
  );
}