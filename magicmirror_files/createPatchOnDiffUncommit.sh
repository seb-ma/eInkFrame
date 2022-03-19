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
pushd ../../MagicMirror/

export fullPath=$(readlink -f .)
# Generate patch files and add lsit to applyPatches.sh script
find . -name .git -execdir sh -c '
	for dirN do
		cd $dirN/..
		fname=${PWD##*/}.patch
		git diff --ignore-space-change ":(exclude)package-lock.json" ":(exclude).gitignore" > $SCRIPT_DIR/patches/$fname
		echo cd ".${PWD#"$fullPath"}" >> $SCRIPT_DIR/applyPatches.sh
		echo "patch -p1 -i \$SCRIPT_DIR/patches/$fname" >> $SCRIPT_DIR/applyPatches.sh
		echo "cd -" >> $SCRIPT_DIR/applyPatches.sh
		echo "" >> $SCRIPT_DIR/applyPatches.sh
	done' sh {} +

cat >> $SCRIPT_DIR/applyPatches.sh<< EOF

popd
EOF

popd