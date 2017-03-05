function generatePdf()
{
	initDroneDeployApi()
	//api
	.then(getCurrentlyViewedPlan)
	.then(getTileFromPlan)
	.then(getTileFromResponse)
	.then(postDataToServer)
	.then(generatePDF)
    .catch(console.log);
}

function initDroneDeployApi()
{	
	return new DroneDeploy({version: 1});
}
	
function getCurrentlyViewedPlan(droneDeployApi)
{
	window.api = droneDeployApi;
	console.log(window.api);
	return window.api.Plans.getCurrentlyViewed();
}

function getTileFromPlan(plan)
{
	console.log(window.api);
	console.log(plan);
	return window.api.Tiles.get({planId: plan.id, layerName: 'ortho', zoom: 16});
}

function getTileFromResponse(res)
{
	console.log(res);
	return res.tiles;
}

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

function generatePDF(encodedTiles) {
  const docDefinition = generatePDFcontent(encodedTiles);
  // decided to have client side PDF printing with the pure javascript module: pdfmake
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