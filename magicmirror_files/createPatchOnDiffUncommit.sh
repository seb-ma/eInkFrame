#!/bin/bash

export currentpath=$(pwd)

echo "#!/bin/bash" > applyPatches.sh
echo "pushd /opt/local/MagicMirror/" >> applyPatches.sh

pushd /opt/local/MagicMirror/
export fullPath=$(readlink -f .)

find . -name .git -execdir sh -c '
	for dirN do
		cd $dirN/..
		fname=${PWD##*/}.patch
		git diff --ignore-space-change ":(exclude)package-lock.json" ":(exclude).gitignore" > $currentpath/patches/$fname
		echo cd ".${PWD#"$fullPath"}" >> $currentpath/applyPatches.sh
		echo "patch < patches/$fname" >> $currentpath/applyPatches.sh
		echo "cd -" >> $currentpath/applyPatches.sh
		echo "" >> $currentpath/applyPatches.sh
	done' sh {} +

echo "popd" >> applyPatches.sh

popd