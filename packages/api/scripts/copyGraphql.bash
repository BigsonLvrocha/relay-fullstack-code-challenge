#!/bin/bash

OLD_FILES=$(find dist/graphql -regextype posix-extended -regex "dist\/graphql\/.*\.graphql")

for FILE in $OLD_FILES; do
  rm $FILE;
done

FILES=$(find src/graphql -regextype posix-extended -regex "src\/graphql\/.*\.graphql")

for FILE in $FILES; do
  DIST_FILE=$(echo $FILE | sed 's/^src/dist/');
  DIST_DIR=$(dirname /$DIST_FILE);
  DIST_DIR_SLICED=$(echo "${DIST_DIR:1:3000}");
  mkdir -p $DIST_DIR_SLICED;
  cp $FILE $DIST_FILE
done
