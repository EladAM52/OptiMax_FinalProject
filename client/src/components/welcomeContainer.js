import React from 'react'
const WelcomeContainer = ({FirstName ,userRole}) => {
  if(userRole === "מנהל"){
    return (
      <div className="welcome-window" dir='rtl'>
      <h1 id="welcomeMessage">שלום, {FirstName}</h1>
      <p id="description">ברוך הבא לתיק הניהול הדיגיטלי שלך בOptiMax .</p>
    </div>
    )
  }
  else{
    return (
      <div className="welcome-window" dir='rtl'>
      <h1 id="welcomeMessage">שלום, {FirstName}</h1>
      <p id="description">ברוך הבא לתיק העובד הדיגיטלי שלך בOptiMax .</p>
    </div>
    )
  }
}

export default WelcomeContainer