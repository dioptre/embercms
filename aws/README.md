Add the lambda function and then setup IAM for user used in sailsjs to upload, and run lambda etc.

ObjectCreated(All) select Lambda (function uploaded)

Sample Cors:

<?xml version="1.0" encoding="UTF-8"?>
<CORSConfiguration xmlns="http://s3.amazonaws.com/doc/2006-03-01/">
    <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
    </CORSRule>
    <CORSRule>
        <AllowedOrigin>http://localhost:4200</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <AllowedMethod>POST</AllowedMethod>
        <AllowedMethod>DELETE</AllowedMethod>
        <AllowedHeader>*</AllowedHeader>
    </CORSRule>
</CORSConfiguration>

Sample Bucket Permissions:

{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "AddPerm",
			"Effect": "Allow",
			"Principal": "*",
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::ecms/*"
		},
		{
			"Sid": "DelegateS3Access",
			"Effect": "Allow",
			"Principal": {
				"AWS": "arn:aws:iam::786462021999:root"
			},
			"Action": "s3:*",
			"Resource": [
				"arn:aws:s3:::ecms/*",
				"arn:aws:s3:::ecms"
			]
		}
	]
}

Sample Resized Permissions:

{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "AddPerm",
			"Effect": "Allow",
			"Principal": "*",
			"Action": "s3:GetObject",
			"Resource": "arn:aws:s3:::ecmsresized/*"
		},
		{
			"Sid": "DelegateS3Access",
			"Effect": "Allow",
			"Principal": {
				"AWS": "arn:aws:iam::786462021999:root"
			},
			"Action": "s3:*",
			"Resource": "arn:aws:s3:::ecmsresized/*"
		}
	]
}
