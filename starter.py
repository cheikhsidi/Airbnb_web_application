import pandas as pd
data = pd.read_csv('listings.csv.gz', compression='gzip',
                   error_bad_lines=False, low_memory=False)
print(len(data))
