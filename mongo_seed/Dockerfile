FROM mongo:5.0
 # Will be set through Environment Files

 COPY roomCount.json /roomCount.json
 COPY userCount.json /userCount.json


 CMD mongoimport --uri mongodb://mongodb:27017/SINGMETA --collection counts --drop --file /roomCount.json && mongoimport --uri mongodb://mongodb:27017/SINGMETA --collection counts --drop --file /userCount.json

