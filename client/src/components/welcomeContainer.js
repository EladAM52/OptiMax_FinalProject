import React from 'react'
const WelcomeContainer = ({userName ,userRole}) => {
  if(userRole === "admin"){
    return (
      <div className="welcome-window" dir='rtl'>
      <h1 id="welcomeMessage">שלום, {userName}</h1>
      <p id="description">ברוך הבא לתיק הניהול הדיגיטלי שלך בOptiMax .</p>
    </div>
    )
  }
  else{
    return (
      <div className="welcome-window" dir='rtl'>
      <h1 id="welcomeMessage">שלום, {userName}</h1>
      <p id="description">ברוך הבא לתיק העובד הדיגיטלי שלך בOptiMax .</p>
    </div>
    )
  }
}

export default WelcomeContainer