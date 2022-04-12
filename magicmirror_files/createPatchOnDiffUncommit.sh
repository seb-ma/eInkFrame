#!/bin/bash

export SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && pwd)

cat > $SCRIPT_DIR/applyPatches.sh<< EOF
#!/bin/bash
SCRIPT_DIR=\$(cd "\$(dirname "\${BASH_SOURCE[0]}")" &> /dev/null && pwd)

# Installation directory
pushd ~/MagicMirror/

EOF

# Delete previous generated patches
rm $SCRIPT_DIR/patches/*.patch

# Installation directory
pushd $SCRIPT_DIR/../../MagicMirror/

export fullPath=$(readlink -f .)
# Generate patch files with stagged files and add list to applyPatches.sh script
find . -name .git -execdir sh -c '
	for dirN do
		cd $dirN/..
		fname=${PWD##*/}.patch
		git diff --staged ":(exclude)package-lock.json" ":(exclude).gitignore" ":(exclude)node_modules" > $SCRIPT_DIR/patches/$fname

		if [ -s $SCRIPT_DIR/patches/$fname ]
		then
			echo cd ".${PWD#"$fullPath"}" >> $SCRIPT_DIR/applyPatches.sh
			echo "echo Applying patch $fname" >> $SCRIPT_DIR/applyPatches.sh
			echo "git apply --ignore-whitespace --whitespace=nowarn \$SCRIPT_DIR/patches/$fname" >> $SCRIPT_DIR/applyPatches.sh
			echo "cd -" >> $SCRIPT_DIR/applyPatches.sh
			echo "" >> $SCRIPT_DIR/applyPatches.sh
		else
			rm $SCRIPT_DIR/patches/$fname
		fi

	done' sh {} +

cat >> $SCRIPT_DIR/applyPatches.sh<< EOF

popd
EOF

popd