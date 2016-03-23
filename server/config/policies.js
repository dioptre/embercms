/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */

//CHANGEME

module.exports.policies = {

  /***************************************************************************
   *                                                                          *
   * Default policy for all controllers and actions (`true` allows public     *
   * access)                                                                  *
   *                                                                          *
   ***************************************************************************/
  '*': [
	  'hasToken',
	      'basicAuth',
	          'passport',
		      'sessionAuth',
		          'ModelPolicy',
			      'AuditPolicy',
			          'OwnerPolicy',
				      'PermissionPolicy',
				          'RolePolicy',
					      'CriteriaPolicy'
						        ],
  AppController: {
    'serve': true
  },
  UserController: {
    "create": true,
    "findOne" : ["hasToken"],
    "find" : ["isAdmin"],
    "isAdmin" : ["isAdmin"],
  },
  AuthController: {
    '*': true,
  },
  PageController: {
    "create" : ["isAdmin"],
    "find" : true,
    "update" : ["isAdmin"],
    "destroy" : ["isAdmin"],
    "findOne" : ["isAdmin"],
  },
  SectionController: {
    "create" : ["isAdmin"],
    "find" : true,
    "update" : ["isAdmin"],
    "destroy" : ["isAdmin"],
    "findOne" : true,
  },
  AmazonController: {
    "sign" : ["hasToken"]
  },
  PhotoController: {
	'*': true
  },
  CompanyController: {
	"populate": ["hasToken"], 
	"findOne" : ["hasToken"],
	"find" : ["hasToken", "ModelPolicy", "PermissionPolicy", "RolePolicy"],
	"checkOut" : ["hasToken"], //Rest is handled in code
	"create" : ["hasToken", "ModelPolicy", "PermissionPolicy", "RolePolicy"],
	"update" : ["isCompanyAdminOrOwner"],
	"approvalRequest" : ["isCompanyAdminOrOwner"],
	"approvalOutstanding" : ["isAdmin"],
	"approvalUpdate" : ["isAdmin"],
	"companySearch" : ["hasToken", "ModelPolicy", "PermissionPolicy", "RolePolicy"],
	"print" : ["hasToken", "ModelPolicy", "PermissionPolicy", "RolePolicy"],
  },

  MembershipController : {
	"populate": ["isCompanyAdminOrOwner"], 
	"create" : ["isCompanyAdminOrOwner"],
	"update" : ["isCompanyAdminOrOwner"],
	"destroy" : ["isCompanyAdminOrOwner"]
  },
  ProjectController : {
	"findOne" : ["isCompanyAdminOrOwner"],
	"populate": ["isCompanyAdminOrOwner"], 
	"create" : ["isCompanyAdminOrOwner"],
	"update" : ["isCompanyAdminOrOwner"],
	"destroy" : ["isCompanyAdminOrOwner"]
  },

  /***************************************************************************
   *                                                                          *
   * Here's an example of mapping some policies to run before a controller    *
   * and its actions                                                          *
   *                                                                          *
   ***************************************************************************/
  // RabbitController: {

  // Apply the `false` policy as the default for all of RabbitController's actions
  // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
  // '*': false,

  // For the action `nurture`, apply the 'isRabbitMother' policy
  // (this overrides `false` above)
  // nurture  : 'isRabbitMother',

  // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
  // before letting any users feed our rabbits
  // feed : ['isNiceToAnimals', 'hasRabbitFood']
  // }
};
