import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import loginAction, { LoginState } from "../actions/login";
import { startTransition, useActionState } from "react";

const formSchema = z.object({
	email: z
		.email(),
	password: z
		.string()
		.min(8, "Password must be at least 8 characters.")
		.max(20, "Password must be at most 20 characters."),
});

const initState: LoginState = {
	success: false
}

export default function useLogin() {

	const [state, formAction, isPending] = useActionState(loginAction, initState)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: ""
		}
	});

	async function onSubmit(data: z.infer<typeof formSchema>) {
		console.log(data);
		try {
			const formData = new FormData();
			formData.append('email', data.email);
			formData.append('password', data.password);

			startTransition(()=>{
				formAction(formData)
			})
			console.log('Success');
			
		} catch (error) {
			console.error('Error');
			
		}
	}

	return {
		form,
		onSubmit,
		state,
		isPending
	};
}
