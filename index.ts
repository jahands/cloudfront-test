import fetch from 'node-fetch'
import PQueue from 'p-queue'

async function main() {
	let httpErrors = 0
	let exceptions = 0
	const url = 'https://d13rq7hk26p07j.cloudfront.net/1almond.log'
	console.log(`Test URL: ${url}`)

	const startTs = new Date()
	const queue = new PQueue({ concurrency: 500 })
	for (let i = 0; i < 5000; i++) {
		const fn = async () => {
			try {
				const res = await fetch(`${url}`)
				await res.arrayBuffer()
				if (!res.ok) {
					httpErrors++
				}
			} catch (err) {
				console.error(err)
				exceptions++
			}
		}
		queue.add(fn)
	}
	await queue.onIdle()

	const endTs = new Date()
	console.log(`Finished in ${endTs.getTime() - startTs.getTime()}ms`)
	console.log(`httpErrors: ${httpErrors}, exceptions: ${exceptions}`)
}

main()
	.then(() => console.log('done'))
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
