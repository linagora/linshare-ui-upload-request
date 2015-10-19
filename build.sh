#!/bin/bash
g_config_file="build.config.sh"
if [ ! -f ${g_config_file} ] ; then
	echo ERROR: Missing ${g_config_file} file to configure this script.
	exit 1
fi
source ${g_config_file}
set -e
#set -x

l_mode=$1

function usage()
{
   if [ ${g_enable_no_min} -eq 1 ] ; then
	   echo "Choose your mode : dev dev-nomin, prod or prod-nomin"
   else
	   echo "Choose your mode : dev or prod"
   fi
   exit 0
}

if [ "${l_mode}" == "" ] ; then
  usage
fi


l_version=$(grep version package.json | cut -d'"' -f4)
l_output="${g_application_name}-${l_version}.tar.bz2"
l_hash="${g_application_name}-${l_version}.sha256sum"
l_git_uuid=$(git log -n 1 --format=oneline|cut -d' ' -f1)
l_dist=${g_application_name}-${l_version}
l_date=$(date "+%Y%m%d%H%M%S")


echo "INFO: Cleaning ..."
rm -fr ${g_application_name}-*
echo "INFO: Building ..."
if [ "${l_mode}" == "dev" ] || [ "${l_mode}" == "prod" ] ; then
	${g_build_cmd}
elif [ "${l_mode}" == "dev-nomin" ] || [ "${l_mode}" == "prod-nomin" ] ; then
	${g_build_min_cmd}
else
  usage
fi

echo "INFO: Packaging..."
if [ "${l_mode}" == "dev" ] ; then
  l_dist="${g_application_name}-${l_version}-${l_git_uuid}"
  l_output="${g_application_name}-${l_version}-${l_date}-${l_git_uuid}.tar.bz2"
  l_hash="${g_application_name}-${l_version}-${l_date}-${l_git_uuid}.sha256sum"
elif [ "${l_mode}" == "dev-nomin" ] ; then
  l_dist="${g_application_name}-${l_version}-nomin-${l_date}-${l_git_uuid}"
  l_output="${g_application_name}-${l_version}-nomin-${l_date}-${l_git_uuid}.tar.bz2"
  l_hash="${g_application_name}-${l_version}-nomin-${l_git_uuid}.sha256sum"
elif [ "${l_mode}" == "prod-nomin" ] ; then
  l_dist="${g_application_name}-${l_version}-nomin"
  l_output="${g_application_name}-${l_version}-nomin.tar.bz2"
  l_hash="${g_application_name}-${l_version}-nomin.sha256sum"
fi

mv -v dist ${l_dist}
if [ "${l_mode}" == "dev" ] || [ "${l_mode}" == "dev-nomin" ] ; then
  sed -i -e 's/debug: true/debug: false/g' ${l_dist}/${g_application_config_file}
  sed -i -e 's/version.*$/version": "'${l_version}-${l_git_uuid}'",/g' ${l_dist}/${g_application_version_file}
fi

tar cjf ${l_output} ${l_dist}
sha256sum ${l_output} > ${l_hash}
mkdir -p distrib
mv -v ${l_output} distrib/
mv -v ${l_hash} distrib/

echo "INFO: Done"

