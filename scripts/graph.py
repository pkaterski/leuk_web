import csv
import matplotlib.pyplot as plt
from pylab import rcParams
from os import listdir

files_names = []
for file_name in listdir('conv'):
    if (file_name.endswith('.csv')):
        files_names.append(file_name)



for file_name in files_names:
    with open(f'conv/{file_name}', newline='') as csvfile:
        lines = csv.reader(csvfile, delimiter=',')
    
        # points 
        data_points_x = []
        data_points_y = []
        itter = next(lines)
        for i,point in enumerate(itter):
            if len(point) == 0:
                continue
            data_points_x.append(i + 1)
            data_points_y.append(float(point))
    
        # Alexan application 
        data_alexan_x = []
        data_alexan_y = []
        itter = next(lines)
        for i,point in enumerate(itter):
            if len(point) == 0:
                continue
            data_alexan_x.append(i + 1)
            data_alexan_y.append(point)
    
        rcParams['figure.figsize'] = 12, 5
        plt.xticks(range(1, len(itter) + 1))
        for x_l in data_alexan_x:
            plt.axvline(x_l, color='r')
        plt.plot(data_points_x, data_points_y, 'bo-')

        #plt.plot(data_alexan_x, data_alexan_y, 'o')

        if False:
            plt.show()
        else:
            plt.savefig(f'figs/{file_name}.png', dpi=199)
        plt.close()


