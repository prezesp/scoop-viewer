import sys
import os


if __name__ == "__main__":
  db_file = os.path.dirname(os.path.realpath(__file__)) + "/scoop-installed-apps.txt"

  if (sys.argv[1] == "install"):
    with open(db_file, 'a') as f:
      f.write(sys.argv[2] + '\n')

  elif (sys.argv[1] == "uninstall"):
    with open(db_file, 'r') as f:
      lines = f.readlines()
    with open(db_file, 'w') as f:
      for line in lines:
        if (line.strip() != sys.argv[2]):
          f.write(line)

  elif (sys.argv[1] == "list"):
    with open(db_file, 'r') as f:
      lines = f.readlines()
      for line in lines:
        print (line.strip())
