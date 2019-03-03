<style>
html,
body {
	height: 100%;
}
</style>


<style scoped>
.layout {
	border: 1px solid #d7dde4;
	background: #f5f7f9;
	position: relative;
	border-radius: 4px;
	overflow: hidden;
	height: 100%;
}
.layout-logo {
	color: #000000;
	float: left;
	position: relative;
	top: 15px;
	left: 20px;
	font-size: 22px;
}
.header {
	padding: 0 200px;
	height: 64px;
	background-color: #ffffff;
	line-height: 64px;
}
.layout-nav {
	width: 100px;
	margin: 0 auto;
  margin-right: 20px;
  text-align: right;
}

.layout-footer-center {
	text-align: center;
}
</style>
<template>
	<div class="layout">
		<Layout>
			<div class="header">
				<a class="layout-logo" href="#"><img src="./assets/logo.svg" height="35"></a>
				<div class="layout-nav">
					<Dropdown v-if="userAccount" placement="bottom-end" @on-click="munuClick">
						<a href="javascript:void(0)">
							{{userAccount}}
							<Icon type="ios-arrow-down"></Icon>
						</a>
						<DropdownMenu slot="list">
							<DropdownItem name="profile">Your profile</DropdownItem>
							<DropdownItem name="logout" divided>Logout</DropdownItem>
						</DropdownMenu>
					</Dropdown>
					<a v-else @click="login">Login</a>
				</div>
			</div>
			<Content :style="{margin: '30px 0 0 0', padding: '0 200px'}">
				<Card dis-hover>
					<div style="min-height: 200px;">
						<router-view></router-view>
					</div>
				</Card>
			</Content>
			<Footer class="layout-footer-center">2019 &copy; eosprofile.x</Footer>
		</Layout>
	</div>
</template>
<script>
export default {
	data() {
		return {
			userAccount: ""
		};
	},
	methods: {
		login() {
			// First we need to connect to the user's Scatter.
			ScatterJS.scatter.connect("EOSProfile").then(connected => {
				// If the user does not have Scatter or it is Locked or Closed this will return false;
				if (!connected) return false;

				this.scatter = ScatterJS.scatter;

				// Now we need to get an identity from the user.
				// We're also going to require an account that is connected to the network we're using.
				const requiredFields = { accounts: [this.$config.eosnet] };
				this.scatter
					.getIdentity(requiredFields)
					.then(ret => {
						this.userAccount = ret.accounts[0].name;
						localStorage.user = this.userAccount
					})
					.catch(error => {
						// The user rejected this request, or doesn't have the appropriate requirements.
						console.error(error);
					});
			});
		},
		logout() {
			this.scatter.logout();
			this.userAccount = undefined;
			localStorage.user = undefined;
		},
		munuClick(name) {
			switch (name) {
				case "profile":
					this.$router.push({ name: 'profile', params: { account: this.userAccount } })
					break;
				case "logout":
					this.logout();
			}
		}
	},
	mounted() {
		if (localStorage.user != undefined) {
			this.login();
		}
	}
};
</script>