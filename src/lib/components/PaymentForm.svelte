<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { API, POST } from '$lib';
	import { invalidate } from '$lib/stores';
	import { fail } from '@sveltejs/kit';
	import QRCode from 'qrcode';
	import { getContext, onMount } from 'svelte';
	import parv_qr from "$lib/assets/parv_qr.jpg";

	export let name: string;
	export let id: string;
	export let amount: number;
	export let participants: any;
	export let goBack: Function;

	let transactionID: string;
	let CAcode: string = '';
	let verified: boolean;
	let imgurl: string;
	let qrcodeurl = `upi://pay?pa=zaifziad11@okicici&pn=******4972&am=149&mc=0000&mode=02&purpose=00`;
	// if (id.startsWith("W")) {
	// 	// qrcodeurl = `upi://pay?pa=pparv2515-1@okhdfcbank&pn=Patel Parv&am=${amount}&mc=1234&mode=02&purpose=events&cu=INR&mam=${amount}`;
	// 	qrcodeurl = parv_qr
	// 	imgurl = parv_qr
	// } else {
	// 	QRCode?.toDataURL(`${qrcodeurl}`, function (err: any, url: string) {
	// 		imgurl = url;
	// 	});
	// }
	imgurl = parv_qr


	const loading: Function = getContext('loading');
	const displayPopUp: Function = getContext('displayPopUp');

	onMount(() => {
		let bgimage = window.document.getElementById('img');
		if (bgimage !== null) {
			bgimage.style.backgroundImage = `url(${imgurl})`;
		}
	});

	function verify() {
		if (CAcode.length != 0 && !verified) {
			return;
		}
		return true;
	}

	async function fetchData() {
		const response = await POST(API.verifyCA, {
			CACode: CAcode
		}, undefined)
			.then((res) => res.json())
			.then((res) => {
				if (res.status == 200) {
					if (res.verified) {
						// handle
						return {"type":"success","data":res};
					} else {
						return fail(400, { ...res, err: res.message });
					}
				} else {
					return fail(400, { ...res, err: res.message });
				}
			})
			.catch((err) => {
				console.log(err.toString());
				return fail(400, {
					success: false,
					err: 'Unable to resolve the response. Please re-try after sometime'
				});
			});
		return response;
	}

	async function handleVerify() {
		loading(true);
		let result = await fetchData();
		// @ts-ignore
		loading(false);
		if (result.type == 'success' && result.data) {
			const data = result.data;
			// console.log(data);
			if (data.verified) {
				verified = true;
				const verifyButton = document.getElementById('verify') as HTMLButtonElement;
				if (verifyButton) {
					verifyButton.disabled = true;
				}
			} else {
				displayPopUp('Alert', data.err, 4000, () => {});
			}
		} else {
			setTimeout(() => {
				displayPopUp(
					'Alert',
					result.data.err ? result.data.err : 'Something went wrong',
					4000,
					() => {}
				);
			}, 100);
		}
	}

	function submit(onsubmit: { [x: string]: any; cancel: () => void }) {
		loading(true);
		onsubmit.formData.set('CACode', CAcode);
		onsubmit.formData.set('eventId', id);
		onsubmit.formData.set("participants",JSON.stringify(participants))
		if (!verify()) {
			loading(false);
			displayPopUp(
				'Alert',
				'Please verify the CACode first or remove it completely.',
				5000,
				() => {}
			);
			onsubmit.cancel();
		}
		// @ts-ignore
		return async ({ result }) => {
			loading(false);

			if (result.type == 'success' && result.data) {
				const data = result.data;
				// console.log(data);
				if (data.success) {
					invalidate.set(true);
					displayPopUp(
						'Success',
						`You have been registered to ${name}. You will receive an email regarding this soon.`,
						10000,
						() => {
							goto('/profile');
						}
					);
				} else {
					displayPopUp('Alert', data.message, 4000, () => goBack());
				}
			} else {
				setTimeout(() => {
					displayPopUp(
						'Alert',
						result.data.err ? result.data.err : 'Something went wrong',
						4000,
						() => goBack()
					);
				}, 100);
			}
		};
	}
</script>

<form class="form" method="post" action="?/pay" use:enhance={submit}>
	<div style="background-color: rgb(90, 14, 137,0.3);" class="payment">
		<div style="display: inline-block;">
			<p style="margin-bottom: 1rem;margin-top: 0.8rem;font-size:155%;display: inline-block">
				Scan here for payment
			</p>
			<div id="img" />
			<p style="margin-top: 1rem;font-size:155%;box-sizing:border-box;font-family:cursive">
				{amount}
			</p>
			<svg style="margin-top: -1rem;" width="120" height="50" fill-rule="evenodd"
				><path d="M95.678 42.9L110 29.835l-6.784-13.516z" fill="#097939" /><path
					d="M90.854 42.9l14.322-13.065-6.784-13.516z"
					fill="#ed752e"
				/><path
					d="M22.41 16.47l-6.03 21.475 21.407.15 5.88-21.625h5.427l-7.05 25.14c-.27.96-1.298 1.74-2.295 1.74H12.31c-1.664 0-2.65-1.3-2.2-2.9l6.724-23.98zm66.182-.15h5.427l-7.538 27.03h-5.58zM49.698 27.582l27.136-.15 1.81-5.707H51.054l1.658-5.256 29.4-.27c1.83-.017 2.92 1.4 2.438 3.167L81.78 29.49c-.483 1.766-2.36 3.197-4.19 3.197H53.316L50.454 43.8h-5.28z"
					fill="#747474"
				/></svg
			>
		</div>
		<p style="display: flex;text-align:center;padding-inline:10px;">If the above QR code doesn't work, please use</p><p> UPI ID: pparv2515-1@okhdfcbank</p>
		<p>OR Pay to HDFC Bank A/C Details:
		</p>
		<p>Account Number: 05001460001487</p>
		<p>Account Holder Name: Vinay Krishna</p>
		<p>IFSC Code: HDFC0000500</p>
	</div>
	<div id="data">
		<p class="tr_label" style="color: #FCF3FF;margin-left:1rem;margin-bottom:0.5rem;text-wrap:break-word;overflow:break-word;">Transaction Id (12-digits. See below for examples)</p>
		<input
			id="transId"
			type="text"
			maxlength="50"
			name="transactionID"
			placeholder="Your Transaction Id"
			style="display:block;"
			bind:value={transactionID}
			required
		/>
		<p style="color: #FCF3FF;margin-left:1rem;margin-bottom:0.5rem">CA Code</p>
		<div class="code_verification">
			<input
				id="CAcode"
				type="text"
				placeholder="Your CA Code(if any)"
				maxlength="6"
				name="CACode"
				style="margin-top:5px;background-color:black !important;border:black"
				bind:value={CAcode}
			/>
			<button id="verify" type="button" style="cursor:pointer" on:click={handleVerify}
				>{verified ? 'Verified' : 'Verify'}</button
			>
		</div>
		<div id="submitButton">
			<p id="warning"></p>
			<button id="submit" type="submit" style="cursor:pointer; display:block; margin-top:5px;"
				>Register Now</button
			>
		</div>
	</div>
</form>

<style>
	.form {
		width: 100vw;
		grid-template-areas: 'data payment';
		grid-column-gap: 3rem;
		margin-top: 4rem;
		padding-top: 0rem;
		margin-bottom: 10rem;
		display: grid;
		align-items: center;
		justify-content: center;
	}
	.payment {
		grid-area: payment;
		/* height: 23rem; */
		width: 20rem;
		text-align: center;
		background-color: black;
		padding-top: 0.7rem;
		border-radius: 10%;
		z-index: 1;
		position: relative;
	}
	* {
		box-sizing: border-box;
	}
	#img {
		display: inline-block;
		height: 10rem;
		padding: 5rem;
		background-size: cover;
		width: 10rem;
	}
	#submitButton {
		width: 25rem;
		margin-top: 1rem;
	}
	#warning {
		color: red;
		height: 0.8rem;
		margin-top: -0.5rem;
		text-align: center;
		visibility: hidden;
	}
	#submitButton > button {
		width: 10rem;
		height: 2.5rem;
		font-size: large;
		border-radius: 2.5em;
		background-color: rgb(0, 183, 255);
		border: none;
		display: block;
		margin: 0 auto;
	}
	.code_verification {
		display: flex;
		text-align: center;
		justify-content: center;
		background-color: black;
		width: 25rem;
		height: 3.5rem;
		border: 2px solid grey;
		border-radius: 10%/70%;
		padding-left: 1rem;
	}
	#transId {
		border: 2px solid grey;
		background-color: black;
		padding-left: 1.5rem;
		width: 25rem;
		height: 3.5rem;
		border-radius: 10%/70%;
		color: #fcf3ff;
		outline: none;
	}
	#verify:disabled {
		background-color: rgb(17, 184, 17);
	}
	#verify {
		background-color: rgb(184, 17, 17);
		color: #fcf3ff;
		border: none;
		height: 1.5rem;
		padding: 0.3rem;
		display: flex;
		text-align: center;
		justify-content: center;
		width: 5rem;
		position: relative;
		margin: auto 0;
		margin-right: 1rem;
		margin-left: 3rem;
		border-radius: 20%/50%;
	}
	#CAcode {
		width: 18rem;
		height: 2.5rem;
		padding-left: 0.5rem;
		color: #fcf3ff;
		outline: none;
	}
	input:-webkit-autofill,
	input:-webkit-autofill:hover,
	input:-webkit-autofill:focus {
		transition: background-color 5000s ease-in-out 0s;
		-webkit-text-fill-color: #fcf3ff;
	}
	#data {
		grid-area: data;
		width: 30rem;
		display: inline-block;
		z-index: 2;
		margin-top: 1rem;
	}

	@media screen and (max-width: 900px) {
		.payment {
			left: 50%;
			transform: translate(-67%);
		}
		.form {
			position: relative;
			left: 50%;
			transform: translate(-35%, 0);
			grid-template-areas:
				'payment'
				'data';
			grid-column-gap: 3rem;
			display: grid;
			align-items: center;
		}
		#data {
			position: relative;
			left: 50%;
			transform: translate(-42%, 0);
		}
		#transId {
			width: 18rem;
		}
		.code_verification {
			width: 18rem;
		}
		#verify {
			margin-left: -1rem;
		}
		#submitButton {
			width: 18rem;
		}
	}
	.tr_label {
		word-wrap: break-word;
		overflow: hidden;
	}

	@media screen and (max-width: 600px) {
		.tr_label {
			width: 60%;
		}
	}
</style>
