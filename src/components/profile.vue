<template>
	<div class="warp">
		<Row>
			<Col span="8">
			<!-- basic info -->
			<div class="basic center">
				<img v-if="profile.avator" class="avator" width="148" height="148" :src="profile.avator"></img>
				<img v-else class="avator" width="148" height="148" src="http://iph.href.lu/149x149?text=暂无头像"></img>

				<div class="nickname">{{profile.name}}</div>
				<div class="account">@{{account}}</div>
				<div class="bio">{{profile.bio}}</div>
				<div class="location">{{profile.location}}</div>
			</div>
			</Col>
			<Col span="14">
			<!-- more info -->
			<div class="more" v-if="profile.user">
				<div class="item" v-if="profile.website">
					<Icon class="icon" type="ios-globe" />
					<a class="link" :href="profile.website">{{profile.website}}</a>
				</div>
				<div class="item" v-if="profile.email">
					<Icon class="icon" type="ios-mail" />
					<a class="link" :href="profile.email">{{profile.email}}</a>
				</div>
				<div class="item" v-if="profile.telegram">
					<Icon class="icon" type="ios-paper-plane" />
					<a class="link" :href="profile.telegram">{{profile.telegram}}</a>
				</div>
			</div>
			<div v-else>
				<p>该账号尚未开通个人空间</p>
				<Button v-if="selfProfile" type="primary" @click="signup" :loading="loading">开通</Button>
			</div>
			</Col>
			<Col span="2">
			<div class="settings">
				<!-- <a @click="">Settings</a> -->
				<Dropdown v-if="profile.user" placement="bottom-end" @on-click="setupClick">
					<a href="javascript:void(0)">
						<Icon type="md-settings" />
						<Icon type="ios-arrow-down"></Icon>
					</a>
					<DropdownMenu slot="list">
						<DropdownItem name="settings">Edit your account/settings</DropdownItem>
						<DropdownItem name="delete" divided>Delete Me!</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</div>
			</Col>
		</Row>

		<!-- modal -->
		<modalEdit ref="modalEdit"></modalEdit>
	</div>
</template>

<script>
import Eos from "eosjs";
import JsonRpc from "eosjs";
import BigNumber from "big-number";
import modalEdit from "./modal-edit";
export default {
	components: {
		modalEdit
	},
	data() {
		return {
			account: "",
			querys: {
				json: true, // Get the response as json
				code: "profile.x", // Contract that we target
				scope: "profile.x", // Account that owns the data
				table: "profile", // Table name
				lower_bound: "",
				limit: 1 // maximum number of rows that we want to get
			},
			profile: {},
			loading: false
		};
	},
	computed: {
		selfProfile() {
			return this.account == localStorage.user
		}
	},
	watch: {
		'$route.params.account'(newValue, oldValue) {
			console.log(newValue)
			if (newValue != oldValue) {
				this.refresh()
			}
		}
	},
	methods: {
		setupClick(name) {
			switch (name) {
				case 'settings':
					this.profile.user = this.account;
					this.$refs.modalEdit.open(this.profile)
					break;
				default:
					this.$Message.warning("developing！")
					break;
			}
		},
		signup() {
			this.loading = true;
			this.scatter = ScatterJS.scatter;
			const account = this.scatter.identity.accounts.find(x => x.blockchain === "eos");
			const eosOptions = { network: this.$config.eosnet, expireInSeconds: 60 };
			const transactionOptions = {
				authorization: [`${account.name}@${account.authority}`]
			};

			const eos = this.scatter.eos(this.$config.eosnet, Eos, eosOptions);
			eos.transfer(account.name, "profile.x", "1.0000 SYS", "signup", transactionOptions).then(trx => {
				console.log(`Transaction ID: ${trx.transaction_id}`);
				this.loading = false;
				this.refresh();
			}).catch(error => {
				this.loading = false;
			});
		},
		refresh() {
			this.profile = {};
			this.account = this.$route.params.account;
			const table_key = new BigNumber(
				Eos.modules.format.encodeName(this.account, false)
			);
			this.querys.lower_bound = table_key.toString();
			this.querys.upper_bound = table_key.plus(1).toString();

			this.$eosRpc.getTableRows(this.querys).then(ret => {
				if (ret.rows.length == 1) {
					this.profile = ret.rows[0];
				}
			}).catch(err => {
				console.log(err);
			});
		}
	},
	mounted() {
		this.refresh();
	},
};
</script>

<style scoped>
.warp {
	padding: 30px 0;
}
.basic {
	line-height: 30px;
}
.more {
	min-height: 1px;
}
.center {
	width: 200px;
	margin: 0 auto;
	text-align: center;
}
.avator {
	border-radius: 50%;
	margin-bottom: 10px;
	border: 1px solid #c9c9c9;
}
.nickname {
	color: #ff6f21;
	font-weight: 700;
	font-size: 24px;
}

.account {
	font-size: 1.3em;
	font-weight: 600;
	margin-bottom: 8px;
}

.item {
	line-height: 25px;
}
.item .icon {
	font-size: 22px;
}
.item .link {
	margin-left: 5px;
}

.link:hover {
	text-decoration: underline;
}
.settings {
	position: absolute;
	right: 18px;
}
</style>