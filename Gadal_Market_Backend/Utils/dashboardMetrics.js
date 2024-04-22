class DashboardMetrics {
  constructor(
    totalRegisteredUsers,
    percentRegisteredSinceLastWeek,
    totalPostedProducts,
    totalSoldOutProducts,
    totalRentedProducts,
    activeUsersDesktop,
    websiteVisitorsPerWeek,
    newUsersSinceLastWeek,
    totalPremiumPosts,
    totalGoldPosts,
    generalVisitorGraphsVsEngagement,
    totalFreePosts
  ) {
    this.totalRegisteredUsers = totalRegisteredUsers;
    this.percentRegisteredSinceLastWeek = percentRegisteredSinceLastWeek;
    this.totalPostedProducts = totalPostedProducts;
    this.totalSoldOutProducts = totalSoldOutProducts;
    this.totalRentedProducts = totalRentedProducts;
    this.activeUsersDesktop = activeUsersDesktop;
    this.websiteVisitorsPerWeek = websiteVisitorsPerWeek;
    this.newUsersSinceLastWeek = newUsersSinceLastWeek;
    this.totalPremiumPosts = totalPremiumPosts;
    this.totalGoldPosts = totalGoldPosts;
    this.generalVisitorGraphsVsEngagement = generalVisitorGraphsVsEngagement;
    this.totalFreePosts = totalFreePosts;
  }
}

module.exports = DashboardMetrics;
