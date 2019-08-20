import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def date(string):
    return datetime.strptime(string,'%m/%d/%y %H:%M')

# def create_start_hour(row):
#     return date(row['started_on']).replace(microsecond=0,second=0,minute=0);
# def create_end_hour(row):
#     return date(row['completed_on']).replace(microsecond=0,second=0,minute=0);
# def create_start_day(row):
#     return date(row['started_on']).date();
# def create_end_day(row):
#     return date(row['completed_on']).date();
# def create_start_week(row):
#     row_date = date(row['started_on']).date()
#     week_day = row_date.weekday()
#     week_start = row_date - timedelta(days=week_day)
#     return week_start;
# def create_end_week(row):
#     row_date = date(row['completed_on']).date()
#     week_day = row_date.weekday()
#     week_start = row_date - timedelta(days=week_day)
#     return week_start;

rideshare = pd.read_csv('src/assets/weekly.csv')
# print(rideshare.dtypes)
rideshare.to_json('src/assets/weekly.json',orient='records')
# rideshare['start_date_hour']        = rideshare.apply(lambda row: create_start_hour(row), axis=1)

# rideshare['start_date_day']         = rideshare.apply(lambda row: create_start_day(row), axis=1)

# rideshare['start_date_week']        = rideshare.apply(lambda row: create_start_week(row), axis=1)
# rideshare['completed_date_week']    = rideshare.apply(lambda row: create_end_week(row), axis=1)

#### BY HOUR #####
# rideshare['completed_date_hour']    = rideshare.apply(lambda row: create_end_hour(row), axis=1)
# export_by_hour = rideshare.groupby('completed_date_hour').agg({'completed_date_hour':np.mean, 'distance_travelled': np.sum})
# print(export_by_hour.head())
# # export_by_hour.to_json('src/assets/trips_by_hour.json',orient='records')

##### BY DAY #####
# rideshare['completed_date_day']     = rideshare.apply(lambda row: create_end_day(row), axis=1)
# export_by_day = rideshare.groupby('completed_date_day').agg({'completed_date_day':np.size, 'distance_travelled': np.sum})
# export_by_day.to_json('src/assets/trips_by_day.json',orient='records')

######

# print(create_start_hour(rideshare.iloc[0]))
# print(rideshare['start_date'].min())



# print(date(rideshare.iloc[0]['started_on']).date())
