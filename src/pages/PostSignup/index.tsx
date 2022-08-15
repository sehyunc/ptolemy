export default () => {
	return (
		<div className="flex items-center dark text-default bg-surface-default h-screen">
			<div className="ml-32 w-[480px]">
				<h1 className="uppercase text-5xl font-extrabold mb-10">asdf</h1>
				<p className="text-xl mb-10">
					Welcome! This is your SonrID. Copy it or write it down, and store it
					somewhere where you will not lose it.
				</p>
				<p className="text-xl mb-10">
					If you lose or forget your SonrID you will lose access to your account
					forever.
				</p>
				<button className="block py-3 rounded bg-primary w-full text-xl font-bold">
					Complete Registration
				</button>
			</div>
		</div>
	)
}
