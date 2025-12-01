import { resendClient, sender } from "../libs/resend.js"; 
import { createWelcomeEmailTemplate } from "./emailTemplate.js";
const emailHandlers = async (name, email, clientURL) => {
	const { data, error } = await resendClient.emails.send({
		from: `${sender.name} <${sender.email}>`,
		to: email,
		subject: "Welcome to chatify",
		html: createWelcomeEmailTemplate(name, clientURL)
	})

	if (error) {
		console.error("Error sending welcome email : ", error);
		throw new Error("Failed to send Email");
	} else{
	console.log("Welcome Email send Successfully", data)

	}
}

export default emailHandlers