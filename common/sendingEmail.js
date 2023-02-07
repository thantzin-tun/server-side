const  nodemailer = require("nodemailer");

let generateCode = () => {
  let code_length = 6;
  let number= "";
  for(let i=0;i<code_length;i++){
    let result = Math.floor(Math.random() * 10);
    number += result;
}
return number;
}

const mailTransporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
      user:"please enter you email",
      pass:"app password"
  }
})


const sendingMail = (mail) => {
      return new Promise((resolve,reject) => {
        let code = generateCode();
        let details = {
          from:"plese enter you email",
          to:mail,
          subject:"Messaging",
          text:"Join with your partners",
          html:`<h4 style="color: blue;">Verification code: <hr> ${code}</h4>`
        }        
            mailTransporter.sendMail(details,(err) => {
                if(err) {
                  reject("No Register this email!");
                }
                else {
                    process.env['EMAIL_CODE'] = code;
                    resolve("Email sent!");
                }
            })
      })
}

module.exports  = sendingMail;

// process.env['NODE_ENV'] = 'production'

