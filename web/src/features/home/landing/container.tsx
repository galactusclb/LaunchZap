import { ProductList } from "@/components/shared/product-list";
import Header from "./components/header";

export default async function LandingPageContainer() {
	// async function getProducts() {
    //     console.log("gg");
        
	// 	const response = await fetch("http://localhost:4000/api/products");
    //     console.log(response);
        
	// 	await new Promise((resolve) => {
	// 		setTimeout(resolve, 2000);
	// 	});

    //     return []
	// }

	return (
		<div className="flex flex-col gap-6 w-full">
			<Header />
			{/* <ProductList /> */}
		</div>
	);
}
