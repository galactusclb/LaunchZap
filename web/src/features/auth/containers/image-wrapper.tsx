import Image from "next/image";

// Next.js Image Component
// https://www.youtube.com/watch?v=8lDxivEusUc
// https://www.youtube.com/watch?v=uNR28b8fgpg
export default function ImageWrapper() {
	return (
		<div className="flex gap-2 flex-wrap relative bg-red-200 w-full h-96">
			<Image
				src={
					"https://dtuhk0izzce4l.cloudfront.net/nir-himi-gSIjbABf9sc-unsplash.jpg"
				}
				alt="bg image"
				fill
				style={{ objectFit: "cover" }}
			/>
			{/* <img src={"/nir-himi-gSIjbABf9sc-unsplash.jpg"} style={{
                width: 200,
                height: 150
            }}/> */}
		</div>
	);
}
