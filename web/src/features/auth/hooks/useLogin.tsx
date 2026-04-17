import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import loginAction, { LoginState } from "../actions/login";
import { startTransition, useActionState, useEffect } from "react";

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

	function onSubmit(data: z.infer<typeof formSchema>) {
		const formData = new FormData();
		formData.append('email', data.email);
		formData.append('password', data.password);

		startTransition(()=>{
			formAction(formData)
		});
	}

	// React to the resolved state here
	useEffect(() => {
	if (state.success) {
		// handle success: redirect, toast, etc.
	}

	if (state.error) {
		// handle error: show toast, set form error, etc.
		// toast.error(state.error);
	}
	}, [state]);

	return {
		form,
		onSubmit,
		state,
		isPending
	};
}
