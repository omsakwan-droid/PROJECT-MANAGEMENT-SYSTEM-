import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendemail=async(options)=>{
    const mailGenerator=new Mailgen({
        theme:"default",
        product:{
            name:"task manager",
            link:"http://taskmanager.com"
        }
    })

   const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
    const emailHTML=mailGenerator.generate(options.mailgenContent);

    const transporter=nodemailer.createTransport({
        host:process.env.MAILTRAP_SMTP_HOST,
        port:process.env.MAILTRAP_SMTP_PORT,
        auth:{
            user:process.env.MAILTRAP_USERNAME,
            pass:process.env.MAILTRAP_PASSWORD
        }

    })

    const mail={
        from:"mail.taskmanager@example.com",
        to:options.email,
        subject:options.subject,
        text:emailTextual,
        html:emailHTML
    }
    
    try{
        await transporter.sendMail(mail);
    }catch(error){
        console.error("email service failed",error);
        console.error("ERROR:",error);
        
    }

}

const emailverificationmailgencontent=(username,verificationurl)=>{
    return {
        body:{
            name:username,
            intro:"Welcome to our application! We're very excited to have you on board.",
            action:{
                instructions:"to get verified please press the button given below",
                button:{
                    color:"#22BC66",
                    text:"verify your email",
                    link:verificationurl
                }
            },
            outro:"Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}


const forgotPasswordMailgenContent=(username,resetUrl)=>{
    return {
        body:{
            name:username,
            intro:"You have requested to reset your password.",
            action:{
                instructions:"To reset your password, please click the button below.",
                button:{
                    color:"#22BC66",
                    text:"Reset your password",
                    link:resetUrl
                }
            },
            outro:"Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}
    
export {emailverificationmailgencontent,forgotPasswordMailgenContent,sendemail}