import csv, os
from datetime import date
from pymongo import MongoClient, ASCENDING

client = MongoClient('mongodb://localhost:27017/')
db = client.black_lives_matter
col = db.shooting

rl_system = col.find({})

dic = {}
aggregation = {}

for each_victim in rl_system:
    a_victim = {}
    city = each_victim["city"]
    state = each_victim["state"]
    city_id = each_victim["city_id"]
    try:
        dic[city_id]
        aggregation[city_id]
    except:
        dic[city_id] = []
        aggregation[city_id] = {}
        aggregation[city_id]["city_id"] = city_id
        aggregation[city_id]["count"] = 0
        aggregation[city_id]["unarmed_count"] = 0
        aggregation[city_id]["average_age"] = 0
        aggregation[city_id]["average_age_count"] = 0
        aggregation[city_id]["minimum_age"] = 999
        aggregation[city_id]["maximum_age"] = 0
        aggregation[city_id]["female_count"] = 0
        aggregation[city_id]["known_black_count"] = 0
        aggregation[city_id]["known_hispanic_count"] = 0
        aggregation[city_id]["known_nonwhite_count"] = 0
        aggregation[city_id]["non_fleeing_count"] = 0
        aggregation[city_id]["body_camera_count"] = 0
    
    # Transformation
    a_victim["name"] = each_victim["name"]
    a_victim["date"] = each_victim["date"]
    a_victim["cause_of_death"] = each_victim["manner_of_"]
    a_victim["armed"] = each_victim["armed"]
    a_victim["age"] = each_victim["age"]
    a_victim["gender"] = each_victim["gender"]
    a_victim["race"] = each_victim["race"]
    a_victim["signs_of_mental_illness"] = each_victim["signs_of_m"]
    a_victim["threat_level"] = each_victim["threat_lev"]
    a_victim["flee"] = each_victim["flee"]
    a_victim["body_camera"] = each_victim["body_camer"]

    # Statistics
    aggregation[city_id]["count"] += 1
    if each_victim["armed"] == "unarmed":
        aggregation[city_id]["unarmed_count"]  += 1

    if int(each_victim["age"]) != 0:
        aggregation[city_id]["average_age"] += int(each_victim["age"])
        aggregation[city_id]["average_age_count"] += 1
        if int(aggregation[city_id]["minimum_age"]) > int(each_victim["age"]):
            aggregation[city_id]["minimum_age"] = int(each_victim["age"])
        if int(aggregation[city_id]["maximum_age"]) < int(each_victim["age"]):
            aggregation[city_id]["maximum_age"] = int(each_victim["age"])
    if each_victim["gender"] == "F":
        aggregation[city_id]["female_count"] += 1
    if each_victim["race"] == "B":
        aggregation[city_id]["known_black_count"] += 1
    if each_victim["race"] == "H":
        aggregation[city_id]["known_hispanic_count"] += 1
    if each_victim["race"] != "W":
        aggregation[city_id]["known_nonwhite_count"] += 1
    if each_victim["flee"] != "Not fleeing":
        aggregation[city_id]["non_fleeing_count"] += 1
    if each_victim["body_camer"] == "True":
        aggregation[city_id]["body_camera_count"] += 1

    dic[city_id].append(a_victim)

# Print out

for index, item in aggregation.items():
    iaa = []
    for _, i in item.items():
        iaa.append(i)
    print(iaa)

import json
with open('C:\\Users\\liu.6544\\Documents\\GitHub\\visualization-police-shootings\\data\\victims.json', 'w', encoding='utf-8') as f:
    json.dump(dic, f, ensure_ascii=False, indent=0)