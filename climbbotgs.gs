function doPost(e){
  try{
    var contents = JSON.parse(e.postData.contents);
    //var contents = JSON.parse(e);
    var sheet = SpreadsheetApp.openById(ssId)
    var rowToday = 0 // Should change this to get the first empty row on ss
    var rowSet = false  
    var todayDate = new Date
    var multipleLogs = false


    //Set correct sheet for each user messaging the bot
    let user = contents.message.chat.first_name
    Logger.log(user)
    if(user == "Owen"){
      sheet = sheet.getSheetByName("o log")
    }

    if(user == "Gabriele"){
      sheet = sheet.getSheetByName("g log")
    }

    /* Get todays date, search for it in date column, set correct row */
    todayDate.toLocaleDateString('en-GB')
    var data = sheet.getDataRange().getValues();
    for(var i = 0; i<data.length;i++){
      if(new Date(data[i][0]).toDateString() == todayDate.toDateString()){
        Logger.log("It's a match, i = " + i)
        rowToday = i + 1
        rowSet = true
      }
    } 

    // If data is first post of the day, set the date and row
    if(rowSet == false){
      rowToday = sheet.getLastRow() + 1
      Logger.log(rowToday)
      sheet.getRange("a" + rowToday).setValue(todayDate)
    }


    // Check if single entry or multiple
    var text = contents.message.text
    if(/,/.test(text)){
      Logger.log("it's got a , in it")
      multipleLogs = true
      let splitLogs = text.split(',')
      Logger.log(splitLogs)
      for (i in splitLogs){
        addLog(splitLogs[i].trimStart(), rowToday, sheet)
      }

    } else {
      addLog(text, rowToday, sheet)
    }
  } catch(e){
    sendText(oId, JSON.stringify(e, null, 4))
  }

}

function checkIfCompletedClimb(climbLog){
  if(/%/.test(climbLog)){
    return false
  }
  else{
    return true
  }
}

function addLog(climbLog, rowToday, sheet){
  if( climbLog.trim() == ""){
    return
  }

  let completedClimb = checkIfCompletedClimb(climbLog)
  if (completedClimb){
    Logger.log("im a completed climb")
    let cellData = sheet.getRange("b"+rowToday).getValue()
    sheet.getRange("b"+rowToday).setValue(cellData + climbLog + ", ")
  } else {
    Logger.log("im a work in progress climb")
    let cellData = sheet.getRange("c"+rowToday).getValue()
    sheet.getRange("c"+rowToday).setValue(cellData + climbLog + ", ")
  }
}
