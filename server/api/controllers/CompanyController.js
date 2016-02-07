/**
 * CompanyController
 *
 * @description :: Server-side logic for managing companies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var Enumerable = require('linq');
var findOne = require('../blueprints/findone.js');
var utility = require('util');
var moment = require('moment');

module.exports = {
	findOneGrouped: function(req,res) {
		Company.findOne({id: req.param("id")}).populate('memberships').populate('projects').then(function (company) {
			if (typeof company === 'undefined' || !company || typeof company.id === 'undefined' || !company.id) {	
				return res.json(403, { error: 'Could not retrieve company '+ req.param("id") });	
			}
			else {		
				sails.models.membership_projects__project_memberships.find({ project_memberships : Enumerable.from(company.projects).select("$.id").toArray() }).then(function (p_m) {
					Enumerable.from(company.projects).forEach(function (p) {
						Enumerable.from(p_m).where("$.project_memberships === '" + p.id +"'").forEach(function (v) {
							(p['memberships'] || (p['memberships'] = [])).push(v.membership_projects);
						})
					});
					Enumerable.from(company.memberships).forEach(function (m) {
						Enumerable.from(p_m).where("$.mebership_projects === '" + m.id +"'").forEach(function (v) {
							(m['projects'] || (m['projects'] = [])).push(v.project_memberships);
						})
					});
					res.json(200, company);
				});
			}
	
		});
	},
	checkOut : function (req,res) { //Takes an id
		var _this = this;
	 	if (typeof req.headers === 'undefined' || !req.headers || typeof req.headers.authorization === 'undefined' || !req.headers.authorization) 
			return res.status(401).json({ error: 'Could not authenticate unknown user '});
		    var token = req.headers.authorization.split(' ');
		    if (token.length !== 2)
			return res.status(401).json({ error: 'Could not authenticate unexpected token'});
		    Token.getUser(req.headers.authorization).then(function(user) {
			if (typeof user === 'undefined' || !user)
				return res.json(403, {error : "User not found."});
			//Shared Function to return company data.			
			var processCompany = function(companyid) {
				Membership.findOne({company: companyid, user: user.id, privileges: { contains: ["admin"]}}).then(function (member) {
					var isAdmin = {id: null}; //id: { '!': null }} = true {{id : null}} = false				
					if (typeof member !== 'undefined' && member) {
						isAdmin = { id: { '!': null }};
					}
					Company.findOne({id: companyid}).where({ or: [{owner : user.id}, isAdmin] }).then(function (company) {
						if (typeof company === 'undefined' || !company || typeof company.id === 'undefined' || !company.id) {	
							return res.json(403, { error: 'Could not retrieve company or insufficient privileges for user '+ user.id });	
						}
						else {					
							(req.options || (req.options = {})).id = companyid;		
							findOne(req,res); //TODO REMEMBER F#$# needed to use this to be correctly interpreted by ember
						}
				
					});
				});
			};


			var companyid = req.params.id;
			//If companyid exists, check ownwership and return
			if (typeof companyid !== 'undefined' && companyid !== 'undefined' && companyid) {
				processCompany(companyid);
			}
			else {
				//Try and find any company the person is member or owner
				//If there's more than one it's a bad request
				//Get the first
				//Or if none return true
				Membership.find({user: user.id, privileges: { contains: ["admin"]}}).then(function (member) {				
					Company.find({ limit : 2}).where({ or : [{owner : user.id}, {company : Enumerable.from(member).select("$.company").toArray()}]}).then(function (companies) {
						if (companies.length === 2) {
							return res.json(406, { error: 'Specific company required for the user '+ user.username });
						}
						else if (companies.length === 1) {
							processCompany(companies[0].id);
						}
						else {
							//Create new company, and add user as admin
							Company.create({owner: user.id, createdBy: user.id}).populate('memberships').exec(function (err, created){
								created.memberships.add({user: user.id, owner: user.id, createdBy: user.id, privileges: ["admin"]});
								created.save(function(err,created) {
									processCompany(created.id);
								});
							});
							
						}
					});
				});


			}		
		})
		.catch(function (err) {
			return res.json(403, { error: err , type:'unknown'});
		});
	},
	print: function (req,res) {
		 var _this = this;
		Token.getUser(req.headers.authorization).then(function(user) {
			if (typeof user === 'undefined' || !user)
				return res.json(403, {error : "User not found."});
			if (typeof req.param("id") === "undefined" || !req.param("id"))
				return res.json(403, {error : "Shortlist not found."});				
			Company.findOne({id: req.params("id")}).populate('projects').populate('memberships').populate('awards').then(function (c) {
				var public_dir = __dirname + "/../../assets/public"; 						
				// put images in public directory
				var file_name = "COMPANY_" + c.id + ".pdf"
				var file_path = path.join(public_dir , file_name);
				//Setup PDF
				var origin = req.get('referrer').replace(/^(.*\/\/.*?\/).*/i, "$1");	
				var doc = new pdfDocument();
				doc.registerFont('theme', __dirname + '/../../assets/fonts/WorkSans-Light.ttf', 'WorkSans-Light')
				var m=doc.font('theme', 16)
				var globalTopIndex=0;
				
				//Defaults
				//LETTER: [612.00, 792.00] Margins:    top: 72    left: 72    bottom: 72    right: 72
				//HEADER		
				var addHeader = function() {
					doc.image(__dirname + "/../../../client/public/assets/header-pdf.jpg", 0, 0, {width: doc.page.width, height: 90});
					doc.image(__dirname + "/../../../client/public/assets/header-title-pdf.png", 20, 20, {width: 245, height: 45});
					//doc.fillColor('black').text(
					//	"Copyright 2016 -  DesignRegister.co", 
					//	doc.page.width - doc.widthOfString("Copyright 2016 -  DesignRegister.co") - 15, 
					//	doc.page.height - 15, 
					//	{width: 100,
					//	height: 100
					//});
					doc.moveDown(2);
				};
				addHeader();
				doc.fillColor('#4a5e63').font('theme', 24).text("Shortlist",{align: 'center', link: origin}).moveDown(1);	
				doc.font('theme', 14).fillColor('#787878 ').text('User: ' + user.username + " @ " + moment(s.updatedAt).format("YYYY-MM-DD"))   
				var promises = [];
				var photos = Enumerable.from(Enumerable.from(c).select(function(v) {
					return Enumerable.from(v.projects).select("$.photos").toArray();
				}).toArray()).flatten().select(function (p) {
					var image = {thumb: p.replace(/(^.+\/\/)([a-zA-Z0-9]+)(\..*\/)(.*)/, '$1$2resized$3resized-$4'), photo: p};
					var options = {
						method: 'GET',
						uri: image.thumb, //'http://' + sails.config.aws.bucket + 'resized.s3.amazonaws.com/',
						//form: {},
						//headers: { /* 'content-type': 'application/x-www-form-urlencoded'  Set automatically */ },
						json : false,
						//body : {},
						encoding: null //Keep binary
					};
					promises.push(rp(options));
					return image;
				}).toArray();						
				Promise.all(promises).then(function(streams) {					
					// Inject image
					for (var i =0; i < streams.length; i++) {
						//doc.image(results[i], 485, i* 40, {fit: [100, 100]}); //Works
					}


					 // doc.moveTo(20, 170)
					 //    .lineTo(600, 170)
					 //    .strokeColor('#999')
					 //    .lineWidth(2)
					 //    .stroke() 

					var perPage = 15
					    , rowHeight = 45
					    , colPadding = 5
					    , margin = {left:50,top:220}
					    , perPageFirst = 9
					    , marginFirst = {left:50,top:300}
					    , line = 3
					    , backgroundWidth = 540
					    , keys = ["name","size","expertise","detail"]
					    , maxImages = 10;

					doc.font('theme', 12).fillColor('black');
					var itemsSchema = {
						name:{type : String, default :  null, format: '', typeString:'string',columnPosition:1, displayName:'Note', colWidth:180, printColWidth:120},								
					};

					var addTableTitle = function () {
						var rowWidthIndexHeader = 0;
						doc.moveDown(5);
						doc.rect(margin.left-5,(margin.top)-4, backgroundWidth, rowHeight).fill('#999')
						Enumerable.from(keys).forEach(function(key, colIndex){

							//var colIndex = itemsSchema[key].columnPosition,
							var rowWidth = itemsSchema[key].printColWidth || 120;

							m.font('theme', 13).fillColor('#111').text(key?String(key).toUpperCase():''
								, margin.left+rowWidthIndexHeader
								, margin.top+12 
								, {width: rowWidth,
								height:rowHeight
							});
							rowWidthIndexHeader+=(rowWidth+colPadding);

						});
					};
					addTableTitle();
					
					Enumerable.from([c]).forEach(function(co, cIndex){
						doc.font('theme', 12)
						var rowWidthIndex = 0;
						if (line > 12) {
							margin.top = 150;
							doc.addPage();
							addHeader();
							addTitle();
							line = 0;
						}


						if (!(cIndex % 2)){
							doc.rect(margin.left-5,(margin.top+rowHeight)+(rowHeight*cIndex)-4, backgroundWidth, rowHeight).fill('#eee')
						}

						keys.forEach(function(key){

							var company = Enumerable.from(c).where("$.id === '" + co + "'").firstOrDefault();
							var colIndex = itemsSchema[key].columnPosition,
							rowWidth =itemsSchema[key].printColWidth || 120,
							content = '';
							var topindex = (margin.top+rowHeight)+(rowHeight*cIndex)
							switch (key) {
							  case 'name':
							    doc.fillColor('#214050').text(
								(company.name || "").toUpperCase(), 
								margin.left+rowWidthIndex, 
								topindex, 
								{width: rowWidth,
								height:rowHeight
							    });
							    break;
							  default:
							    break;
							}					



							globalTopIndex=topindex
							rowWidthIndex+=(rowWidth+colPadding); ///almost pull objects and sort them				
						})
						line++;
						doc.moveDown(1)
						var topPhotos = [];
						Enumerable.from(c).where("$.id === '" + co + "'").select('$.projects').forEach(function (pp,i) {								
							topPhotos = topPhotos.concat(Enumerable.from(pp).select("$.photos").toArray());
						});
						topPhotos = [].concat.apply([],Enumerable.from(topPhotos).take(maxImages).toArray()); //Extract array
						if (topPhotos.length > 0) {
							if (!(cIndex % 2)){
								doc.rect(margin.left-5,(margin.top+(rowHeight*2))+(rowHeight*cIndex)-4, backgroundWidth, rowHeight).fill('#eee')
							}
							Enumerable.from(topPhotos).forEach(function (v, i) {
								Enumerable.from(photos).forEach(function (p, stream) {
									if (v === p.photo)
										doc.image(streams[stream], margin.left + (i*rowHeight +10 ), (margin.top+(rowHeight*2))+(rowHeight*cIndex)+1, {fit: [rowHeight-10, rowHeight -10]});
								});
									
							});
							line++;
							
						}
						doc.moveDown(1)
						


					});
					if (typeof s.notes === 'string' && s.notes && s.notes.length > 0){
						doc.addPage();
						addHeader();
						doc.font('theme', 14).moveDown(1).fillColor('#787878 ').text('Notes: ')
						doc.font('theme', 14).fillColor('#787878').text(s.notes).moveDown(1);
					 }  
					//doc.font('theme', 16).text('Total: ',400,(globalTopIndex+rowHeight+30),700,100)
					var w = fs.createWriteStream(file_path);
					w.on('finish', function(){
				
						//Now move to s3
		                               	var formData = sails.config.aws.getToken(file_name);
	                               		var r = request.post('http://' + sails.config.aws.bucket + '.s3.amazonaws.com/', function optionalCallback(err, httpResponse, body) {

		                                       if (err || (typeof httpResponse !== 'undefined' && httpResponse.statusCode !== 201)) {
		                                               return res.json(500, {error: err || body, statusCode: err || httpResponse.statusCode});
		                                       }
						       //TODO: Could use promises if we download all thumbs for cache instead
		                                       fs.unlink(file_path, (err) => {
		                                               if (err) 
		                                                       console.log('Failed to delete file: ' + file_path);
		                                               return res.ok();
		                                       });                                                                             
		                               	});
						var form = r.form();
						Enumerable.from(formData).forEach(function(v,i){form.append(v.key,v.value);});
						form.append('file', fs.createReadStream(file_path), {name: "file", filename: 'unicycle.jpg', 'Content-Type' : formData['Content-Type']}); //content-type?

					});
					doc.pipe(w) //# write to PDF
					//doc.pipe res                                       # HTTP response
					doc.end()

						

				})
				.catch(function (err) {
					return res.json(500, {error: err});
				}); //photos


			}); //company

		
			//return res.status(404); //Return before here and just remember this as example, phantomjs is shite at rendering - just build it and put it in ./node_modules/.bin and reference it
			//var childArgs = [
			//	path.join(public_dir, 'shortlist.js'),
			//	url_to_process,
			//	image_path
			//]
			//childProcess.execFile(__dirname + "/../../node_modules/.bin/phantomjs", childArgs, function (err, stdout, stderr) {
			//	//console.log(err,stdout,stderr)			
			//						
			//})
			
		
		}) //user
		.catch(function (err) {
			res.json(404, err);
		});



	},
	
};

