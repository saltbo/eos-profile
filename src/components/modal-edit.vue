
<template>
	<div>
		<Modal v-model="show">
			<p slot="header">
				<Icon type="ios-information-circle"></Icon>
				<span>Edit</span>
			</p>
			<div style="width: 400px;">
				<Form class="form" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
					<FormItem label="Account" prop="user">
						<Input v-model="formValidate.user" readonly disabled></Input>
					</FormItem>
					<FormItem label="Name" prop="name">
						<Input v-model="formValidate.name"></Input>
					</FormItem>
					<FormItem label="Email" prop="email">
						<Input v-model="formValidate.email"></Input>
					</FormItem>
					<FormItem label="Bio" prop="bio">
						<Input v-model="formValidate.bio" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="Tell us a little bit about yourself"></Input>
					</FormItem>
					<FormItem label="URL" prop="website">
						<Input v-model="formValidate.website"></Input>
					</FormItem>
					<FormItem label="Location" prop="location">
						<Input v-model="formValidate.location"></Input>
					</FormItem>
				</Form>
			</div>
			<div slot="footer">
				<Button type="primary" :loading="loading" @click="submit">Update Profile</Button>
			</div>
		</Modal>
	</div>
</template>

<script>
import BigNumber from "big-number";
import JsonRpc from "eosjs";
import Eos from "eosjs";
export default {
	data() {
		return {
			show: false,
			loading: false,
			account: "",
			querys: {
				json: true, // Get the response as json
				code: "profile.x", // Contract that we target
				scope: "profile.x", // Account that owns the data
				table: "profile", // Table name
				lower_bound: "",
				limit: 1 // maximum number of rows that we want to get
			},
			formValidate: {
				name: "",
				email: "",
				bio: "",
			},
			ruleValidate: {
				name: [{ required: true, message: "请填写昵称", trigger: "blur" }],
				intro: [
					{ required: true, message: "请填写描述", trigger: "blur" },
					{
						type: "string",
						max: 2000,
						message: "描述不能超过2000个字符",
						trigger: "blur"
					}
				]
			}
		};
	},
	methods: {
		open: function (profile) {
			this.show = true;

			console.log(profile)
			this.formValidate = profile;
		},
		close() {
			this.show = false;
			this.querys = {};
		},
		submit() {
			this.scatter = ScatterJS.scatter;
			const account = this.scatter.identity.accounts.find(x => x.blockchain === "eos");
			const actions = [
				{
					account: "profile.x",
					name: "setup",
					authorization: [
						{
							actor: account.name,
							permission: account.authority
						}
					],
					data: this.formValidate
				}
			];

			const eosOptions = { network: this.$config.eosnet, expireInSeconds: 60 };
			const eos = this.scatter.eos(this.$config.eosnet, Eos, eosOptions);
			eos.transaction({ actions: actions }, { blocksBehind: 3, expireSeconds: 30 }).then(ret => {
				console.log(ret);
				this.close();
				this.$emit("success")
			}).catch(error => {
				console.error(error);
				this.loading = false;
			});
		}
	},
	mounted() {

	}
};
</script>

<style scoped>
</style>